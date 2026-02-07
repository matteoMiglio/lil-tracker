import { defineStore } from "pinia";
import type { Season } from "@/types/season";
import { apiFetch } from "@/lib/api";

export const useSeasonsStore = defineStore("seasons", {
  state: () => ({
    seasons: [] as Season[],
    newItem: {
      name: "",
    } as Omit<Season, "id" | "active">,
    errors: {} as { [key: string]: string },
    loading: false,
    error: null as string | null,
  }),
  getters: {
    activeSeason(state): Season | undefined {
      return state.seasons.find((s) => s.active);
    },
  },
  actions: {
    async add() {
      this.loading = true;
      try {
        console.debug("Adding new season");

        const response = await apiFetch("/seasons", {
          method: "POST",
          body: JSON.stringify(this.newItem),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante la creazione di una nuova stagione",
          );
        }

        const rawSeason = (await response.json()) as Season;

        this.seasons.push(rawSeason);

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
        throw message;
      } finally {
        this.loading = false;
      }
    },
    async delete(id: string) {
      this.loading = true;
      console.debug("Deleting season:", id);
      try {
        const response = await apiFetch(`/seasons/${id}`, {
          method: "DELETE",
        });

        console.debug("Response Status:", response.status);

        if (response.status !== 204) {
          throw new Error("Failed to delete season");
        }

        this.seasons = this.seasons.filter((item) => item.id !== id);

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
      } finally {
        this.loading = false;
      }
    },
    async update(updatedSeason: Season) {
      this.loading = true;
      console.debug("Updating season:", updatedSeason.id);
      try {
        const response = await apiFetch(`/seasons/${updatedSeason.id}`, {
          method: "PUT",
          body: JSON.stringify(updatedSeason),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante l'aggiornamento della stagione",
          );
        }

        const updatedSeasonResponse = (await response.json()) as Season;

        const index = this.seasons.findIndex(
          (item) => item.id === updatedSeason.id,
        );
        if (index !== -1) {
          this.seasons[index] = updatedSeasonResponse;
        }

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
      } finally {
        this.loading = false;
      }
    },
    async activate(id: string) {
      this.loading = true;
      console.debug("Activating season:", id);
      try {
        const response = await apiFetch(`/seasons/${id}`, {
          method: "PUT",
          body: JSON.stringify({ active: true }),
        });

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante l'attivazione della stagione",
          );
        }

        this.seasons = this.seasons.map((s) => ({
          ...s,
          active: s.id === id,
        }));

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      this.loading = true;
      console.debug("Fetching seasons...");

      try {
        const response = await apiFetch("/seasons");
        const seasons: Season[] = await response.json();

        console.info("Fetched", seasons.length, "seasons");

        this.seasons = seasons;

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
        throw new Error("Errore nel caricamento delle stagioni");
      } finally {
        this.loading = false;
      }
    },
    resetNewItem() {
      this.newItem = {
        name: "",
      } as Omit<Season, "id" | "active">;
    },
  },
});
