import type { CollectionEntry } from "astro:content";
import { createSignal, For, type JSX, Show } from "solid-js";

type Provider = CollectionEntry<"providers">;
type Dataset = CollectionEntry<"datasets">;

const inlineNumberInput = `
	w-20
	rounded-md border border-gray-300 bg-white px-2 py-1 text-sm
	text-right tabular-nums
	focus:ring-2 focus:ring-blue-500 focus:outline-none
	dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100
	dark:focus:ring-blue-400
`;

function CostComponent(props: { providers: Provider[]; datasets: Dataset[] }) {
	const providers = props.providers;
	const datasets = props.datasets;

	const [selectedProvider, setSelectedProvider] = createSignal<Provider>(
		providers[0],
	);

	const [selectedDataset, setSelectedDataset] = createSignal<Dataset>(
		datasets[0],
	);

	const [chooseSize, setChooseSize] = createSignal<boolean>(false);
	const [customSizeGb, setCustomSizeGb] = createSignal<number>(100);
	const [chunkSizeMb, setChunkSizeMb] = createSignal<number>(5);

	const sizeGb = () => {
		if (chooseSize()) {
			return customSizeGb();
		}
		return selectedDataset().data.size_gb;
	};

	const selectDataset: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
		const slug = event.currentTarget.value;
		setChooseSize(slug === "choose");
		const selected = datasets.find((item: Dataset) => item.id === slug);
		if (selected) setSelectedDataset(selected);
	};

	const selectProvider: JSX.EventHandler<HTMLSelectElement, Event> = (
		event,
	) => {
		const slug = event.currentTarget.value;
		const selected = providers.find((item: Provider) => item.id === slug);
		if (selected) setSelectedProvider(selected);
	};

	return (
		<div
			class="
				rounded-xl border border-gray-200 bg-white p-6 shadow-sm
				dark:border-gray-800 dark:bg-gray-950
			"
		>
			<div
				class="
					flex flex-wrap items-center gap-2
					text-2xl font-semibold text-gray-900
					dark:text-gray-100
				"
			>
				<span>Storing</span>

				<select
					onChange={selectDataset}
					class="
						rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base
						focus:ring-2 focus:ring-blue-500 focus:outline-none
						dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100
						dark:focus:ring-blue-400
					"
				>
					<For each={props.datasets}>
						{(dataset) => (
							<option value={dataset.id}>
								{dataset.data.name}: {dataset.data.size_gb} GB
							</option>
						)}
					</For>
					<option value="choose">Choose size...</option>
				</select>
				<Show when={chooseSize()}>
					<input
						type="number"
						value={customSizeGb()}
						onInput={(e) => setCustomSizeGb(+e.currentTarget.value)}
						class={inlineNumberInput}
						aria-label="Custom dataset size (GB)"
					/>
				</Show>

				<span class="text-base text-gray-700 dark:text-gray-300">GB</span>

				<span>on</span>

				<select
					onChange={selectProvider}
					class="
						rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base
						focus:ring-2 focus:ring-blue-500 focus:outline-none
						dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100
						dark:focus:ring-blue-400
					"
				>
					<For each={props.providers}>
						{(provider) => (
							<option value={provider.id}>{provider.data.name}</option>
						)}
					</For>
				</select>
			</div>
			<Show when={!chooseSize()}>
				<p class="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-snug">
					{selectedDataset().data.description}.{" "}
					<a
						class="underline text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
						target="_blank"
						href={selectedDataset().data.url}
					>
						More…
					</a>
				</p>
			</Show>
			<dl class="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
				<div class="flex items-center justify-between py-3">
					<dt class="text-sm text-gray-600 dark:text-gray-400">
						Total storage cost
					</dt>
					<dd class="text-sm font-medium text-gray-900 dark:text-gray-100 tabular-nums">
						{(selectedProvider().data.cost_per_gb_stored * sizeGb()).toFixed(2)}
						{selectedProvider().data.currency}
					</dd>
				</div>

				<div class="flex items-center justify-between py-3">
					<dt class="text-sm text-gray-600 dark:text-gray-400">
						Egress cost of one copy
					</dt>
					<dd class="text-sm font-medium text-gray-900 dark:text-gray-100 tabular-nums">
						{(selectedProvider().data.cost_per_gb_egress * sizeGb()).toFixed(2)}
						{selectedProvider().data.currency}
					</dd>
				</div>

				<div class="flex items-center justify-between py-3">
					<dt class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
						<span>Transaction costs for one copy using </span>
						<input
							type="number"
							value={chunkSizeMb()}
							onInput={(e) => setChunkSizeMb(+e.currentTarget.value)}
							class={inlineNumberInput}
							aria-label="Chunk size in MB"
						/>
						<span class="text-gray-500">MB chunks</span>
					</dt>
					<dd class="text-sm font-medium text-gray-900 dark:text-gray-100 tabular-nums">
						{(
							((selectedProvider().data.cost_per_1k_gets / 1000) *
								(sizeGb() * 1024 * 1024 * 1024)) /
							(chunkSizeMb() * 1024 * 1024)
						).toFixed(2)}
						{selectedProvider().data.currency}
					</dd>
				</div>
			</dl>
		</div>
	);
}

export default CostComponent;
