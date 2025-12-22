import { defineCollection, z } from "astro:content";

import { file } from "astro/loaders";

const datasets = defineCollection({
	loader: file("sample_datasets.yml"),
	schema: z.object({
		name: z.string(),
		size_gb: z.number(),
		format: z.string(),
		description: z.string(),
		url: z.string(),
	}),
});

const providers = defineCollection({
	loader: file("storage_providers.yml"),
	schema: z.object({
		name: z.string(),
		cost_per_gb_stored: z.number(),
		cost_per_gb_egress: z.number(),
		cost_per_1k_gets: z.number(),
		pricing_page: z.string(),
		currency: z.string(),
	}),
});

export const collections = { datasets, providers };
