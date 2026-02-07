# N+1 Query Reference

## What is N+1?

The N+1 query problem occurs when code executes N additional queries to fetch related data for N records, instead of fetching all data in a single query.

```ruby
# BAD: N+1 - executes 1 + N queries
users = User.all           # 1 query
users.each do |user|
  puts user.posts.count    # N queries (one per user)
end

# GOOD: Eager loading - executes 2 queries
users = User.includes(:posts).all  # 2 queries total
users.each do |user|
  puts user.posts.size     # No additional queries
end
```

## Detection Patterns

### In Controllers

```ruby
# BAD patterns to search for:
@items.each { |i| i.association.method }
@items.map { |i| i.relation.attribute }
@collection.map(&:association)

# Search command:
grep -rn "\.each.*\.\|\.map.*\." app/controllers/ --include="*.rb"
```

### In Views/Templates

```ruby
# BAD: Accessing associations in loops
<% @orders.each do |order| %>
  <%= order.customer.name %>     # N+1!
  <%= order.items.count %>       # N+1!
<% end %>

# GOOD: Preload in controller
@orders = Order.includes(:customer, :items)
```

### In Serializers/JSON

```ruby
# BAD: as_json with associations
users.map { |u| u.as_json(include: :posts) }  # N+1!

# GOOD: Preload first
User.includes(:posts).map { |u| u.as_json(include: :posts) }
```

## Solutions

### 1. includes (Preload + Eager Load)

Rails chooses the best strategy automatically.

```ruby
# Single association
User.includes(:posts)

# Multiple associations
User.includes(:posts, :comments)

# Nested associations
User.includes(posts: :comments)

# Complex nesting
User.includes(posts: [:comments, :tags])
```

### 2. preload (Separate Queries)

Forces separate queries, useful when you can't use a JOIN.

```ruby
# Always uses separate queries
User.preload(:posts)

# Good for: polymorphic associations, multiple databases
```

### 3. eager_load (LEFT OUTER JOIN)

Forces a single JOIN query.

```ruby
# Uses LEFT OUTER JOIN
User.eager_load(:posts)

# Good for: filtering by association, ordering by association
User.eager_load(:posts).where(posts: { published: true })
```

### 4. Counter Cache

For `.count` or `.size` on associations:

```ruby
# Migration
add_column :users, :posts_count, :integer, default: 0

# Model
class Post < ApplicationRecord
  belongs_to :user, counter_cache: true
end

# Now user.posts.size uses cached column (no query)
```

### 5. Strict Loading (Rails 6.1+)

Catch N+1 in development:

```ruby
# Per-query
User.strict_loading.includes(:posts)

# Per-model
class User < ApplicationRecord
  self.strict_loading_by_default = true
end

# Globally in config/environments/development.rb
config.active_record.strict_loading_by_default = true
```

## Common Scenarios

### Scenario 1: Index with Related Data

```ruby
# Controller
def index
  # BAD
  @orders = Order.all

  # GOOD
  @orders = Order.includes(:customer, :items)
                 .order(created_at: :desc)
end

# View
@orders.each do |order|
  order.customer.name  # No N+1 with includes
  order.items.size     # No N+1 with includes
end
```

### Scenario 2: JSON API Response

```ruby
# BAD
def index
  render json: Order.all.as_json(include: [:customer, :items])
end

# GOOD
def index
  orders = Order.includes(:customer, :items)
  render json: orders.as_json(include: [:customer, :items])
end
```

### Scenario 3: Inertia Props

```ruby
# BAD
def index
  render inertia: 'orders/Index', props: {
    orders: Order.all.map { |o| serialize_order(o) }
  }
end

# GOOD
def index
  orders = Order.includes(:customer, :items)
  render inertia: 'orders/Index', props: {
    orders: orders.map { |o| serialize_order(o) }
  }
end
```

### Scenario 4: Nested Associations

```ruby
# Loading deeply nested data
Post.includes(comments: { user: :avatar })
    .includes(:tags)
    .includes(author: :profile)
```

## Bullet Gem

Add automatic N+1 detection:

```ruby
# Gemfile
gem 'bullet', group: 'development'

# config/environments/development.rb
config.after_initialize do
  Bullet.enable = true
  Bullet.alert = true
  Bullet.bullet_logger = true
  Bullet.console = true
  Bullet.rails_logger = true
end
```

Bullet will alert you when:
- N+1 queries are detected
- Unused eager loading is present
- Counter cache would help

## Performance Tips

1. **Don't over-eager-load**: Only include associations you actually use
2. **Use `select` to limit columns**: `User.select(:id, :name).includes(:posts)`
3. **Paginate large collections**: N+1 on 10 records is different from 10,000
4. **Consider caching**: For rarely-changing data, cache the result
5. **Monitor in production**: Use tools like Skylight, Scout, or New Relic
