# Security Reference

## OWASP Top 10 for Rails

### 1. Injection (SQL, Command)

```ruby
# BAD: SQL Injection
User.where("name = '#{params[:name]}'")
User.where("name = '" + params[:name] + "'")

# GOOD: Parameterized queries
User.where(name: params[:name])
User.where("name = ?", params[:name])
User.where("name = :name", name: params[:name])

# BAD: Command Injection
system("convert #{params[:file]}")
`ls #{params[:dir]}`

# GOOD: Use arrays for system commands
system("convert", params[:file])
# Or validate/sanitize input
```

### 2. Broken Authentication

```ruby
# Use Rails 8 authentication generator
rails generate authentication

# Secure session configuration
Rails.application.config.session_store :cookie_store,
  key: '_app_session',
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax

# Password requirements
validates :password, length: { minimum: 12 },
                     format: { with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/ }
```

### 3. Sensitive Data Exposure

```ruby
# Use Rails credentials
Rails.application.credentials.secret_key

# Filter sensitive params in logs
config.filter_parameters += [:password, :token, :api_key, :secret]

# Don't expose IDs in URLs when possible
# Use slugs or UUIDs instead

# HTTPS only in production
config.force_ssl = true
```

### 4. XML External Entities (XXE)

```ruby
# Use safe XML parsing
Nokogiri::XML(xml_string) do |config|
  config.strict.nonet  # Disable network access
end

# Prefer JSON over XML when possible
```

### 5. Broken Access Control

```ruby
# Always scope queries to current user
def show
  # BAD
  @order = Order.find(params[:id])

  # GOOD
  @order = current_user.orders.find(params[:id])
end

# Use authorization gems
# Pundit example:
class OrderPolicy
  def show?
    record.user == user || user.admin?
  end
end

# In controller
authorize @order
```

### 6. Security Misconfiguration

```ruby
# config/environments/production.rb
config.force_ssl = true
config.ssl_options = { hsts: { subdomains: true } }

# Disable detailed errors in production
config.consider_all_requests_local = false

# Set security headers (use rack-attack or secure_headers gem)
config.action_dispatch.default_headers = {
  'X-Frame-Options' => 'SAMEORIGIN',
  'X-XSS-Protection' => '1; mode=block',
  'X-Content-Type-Options' => 'nosniff'
}
```

### 7. Cross-Site Scripting (XSS)

```ruby
# Rails auto-escapes by default in ERB
<%= user.name %>  # Safe

# DANGEROUS: raw/html_safe
<%= raw user.bio %>        # XSS risk!
<%= user.bio.html_safe %>  # XSS risk!

# If you must allow HTML, sanitize:
<%= sanitize user.bio, tags: %w[p br strong em] %>

# In Vue/Inertia:
# SAFE
<p>{{ user.name }}</p>

# DANGEROUS
<p v-html="user.bio"></p>  # Only if bio is sanitized server-side
```

### 8. Insecure Deserialization

```ruby
# NEVER deserialize untrusted data
# BAD
Marshal.load(user_input)
YAML.load(user_input)

# GOOD: Use JSON
JSON.parse(user_input)

# If YAML needed:
YAML.safe_load(user_input, permitted_classes: [Symbol, Date])
```

### 9. Using Components with Known Vulnerabilities

```bash
# Check Ruby gems
bundle audit check --update

# Check npm packages
npm audit

# Keep dependencies updated
bundle update --conservative
npm update
```

### 10. Insufficient Logging & Monitoring

```ruby
# Log security events
Rails.logger.info "User #{current_user.id} accessed #{request.path}"

# Log failed authentications
Rails.logger.warn "Failed login attempt for #{params[:email]} from #{request.ip}"

# Use structured logging in production
config.log_formatter = ::Logger::Formatter.new
# Or use lograge gem for JSON logs
```

## CSRF Protection

```ruby
# ApplicationController
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
end

# For Inertia.js, share CSRF token
inertia_share csrf_token: -> { form_authenticity_token }

# In Vue forms, include token:
<Form method="post" action="/orders">
  <!-- CSRF token is automatically included by Inertia -->
</Form>
```

## Mass Assignment Protection

```ruby
# Always use strong parameters
def order_params
  params.require(:order).permit(:product_id, :quantity, :notes)
end

# Never permit all
params.permit!  # DANGEROUS

# Be explicit about nested attributes
def user_params
  params.require(:user).permit(
    :name, :email,
    address_attributes: [:street, :city, :zip]
  )
end
```

## File Upload Security

```ruby
# Validate file types
validates :document, content_type: ['application/pdf', 'image/png', 'image/jpeg']

# Validate file size
validates :avatar, size: { less_than: 5.megabytes }

# Use Active Storage with private URLs
has_one_attached :document

# Generate signed URLs
rails_blob_url(@document, disposition: "attachment")

# Store outside webroot (Active Storage default)
```

## API Security

```ruby
# Rate limiting with rack-attack
class Rack::Attack
  throttle('api/ip', limit: 100, period: 1.minute) do |req|
    req.ip if req.path.start_with?('/api')
  end
end

# Validate API tokens
before_action :authenticate_api_token

def authenticate_api_token
  token = request.headers['Authorization']&.split(' ')&.last
  @api_user = ApiToken.find_by(token: token)&.user
  head :unauthorized unless @api_user
end
```

## Security Checklist

### Before Deploy
- [ ] `bundle audit` passes
- [ ] `npm audit` passes
- [ ] `brakeman` has no high/medium warnings
- [ ] Force SSL enabled in production
- [ ] Sensitive data filtered from logs
- [ ] CSRF protection enabled
- [ ] Strong parameters used everywhere
- [ ] Authorization checks on all actions
- [ ] No secrets in version control
- [ ] Security headers configured

### Ongoing
- [ ] Dependencies updated regularly
- [ ] Security patches applied promptly
- [ ] Failed login attempts monitored
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Regular security audits
