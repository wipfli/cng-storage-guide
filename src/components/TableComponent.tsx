import type { CollectionEntry } from "astro:content";
import {
	type ColumnDef,
	createSolidTable,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
} from "@tanstack/solid-table";
import { createSignal, For, type JSX } from "solid-js";

type Provider = CollectionEntry<"providers">;

const defaultColumns: ColumnDef<Provider>[] = [
	{
		accessorFn: (row) => row.data.name,
		cell: (info) => info.getValue(),
		header: "name",
	},
	{
		accessorFn: (row) => row.data.cost_per_gb_stored,
		cell: (info) => info.getValue(),
		header: "Cost per GB/Month",
		enableSorting: true,
	},
	{
		accessorFn: (row) => row.data.cost_per_1k_gets,
		cell: (info) => info.getValue(),
		header: "Cost per 1000 GETs",
		enableSorting: true,
	},
	{
		accessorFn: (row) => row.data.cost_per_gb_egress,
		cell: (info) => info.getValue(),
		header: "Egress per GB",
		enableSorting: true,
	},
	{
		accessorFn: (row) => row.data.currency,
		cell: (info) => info.getValue(),
		header: "Currency",
		enableSorting: true,
	},
	{
		accessorFn: (row) => row.data.pricing_page,
		cell: (info) => {
			const href = info.getValue() as string | undefined;
			return (
				<a class="underline text-blue-500" target="_blank" href={href ?? "#"}>
					pricing
				</a>
			);
		},
		header: "Pricing page",
	},
];

function TableComponent(props: { providers: Provider[] }) {
	const [sorting, setSorting] = createSignal([]);

	const table = createSolidTable({
		get data() {
			return props.providers;
		},
		columns: defaultColumns,
		state: {
			get sorting() {
				return sorting();
			},
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div
			class="
				overflow-x-auto rounded-xl border
				border-gray-200 bg-white shadow-sm
				dark:border-gray-800 dark:bg-gray-950
			"
		>
			<table class="w-full border-collapse text-sm">
				<thead class="bg-gray-50 dark:bg-gray-900">
					<For each={table.getHeaderGroups()}>
						{(headerGroup) => (
							<tr>
								<For each={headerGroup.headers}>
									{(header) => (
										<th
											onClick={header.column.getToggleSortingHandler()}
											class="
												select-none px-4 py-3 text-left font-semibold
												text-gray-700 hover:bg-gray-100 cursor-pointer
												dark:text-gray-200 dark:hover:bg-gray-800
											"
										>
											<div class="flex items-center gap-1">
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												<span class="text-xs text-gray-400 dark:text-gray-500">
													{{
														asc: "▲",
														desc: "▼",
													}[header.column.getIsSorted() as string] ?? ""}
												</span>
											</div>
										</th>
									)}
								</For>
							</tr>
						)}
					</For>
				</thead>

				<tbody class="divide-y divide-gray-100 dark:divide-gray-800">
					<For each={table.getRowModel().rows}>
						{(row) => (
							<tr
								class="
									transition-colors
									hover:bg-gray-50 dark:hover:bg-gray-900
								"
							>
								<For each={row.getVisibleCells()}>
									{(cell) => (
										<td
											class="
												px-4 py-3 align-middle
												text-gray-800 dark:text-gray-100
											"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									)}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}

export default TableComponent;
