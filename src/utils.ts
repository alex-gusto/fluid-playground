import { Tree } from "fluid-framework";
import { Group, Items, NodeItem } from "./schemas";

export function findNode(items: Items, id: string): [NodeItem | undefined, Group | undefined] {
	let i = 0;
	for (const item of items) {
		if (Tree.is(item, Group)) {
			const [node, group] = findNode(item.items, id);
			if (node !== undefined) {
				return [node, group];
			}
		} else if (item.id === id) {
			const group = items.at(i + 1);
			if (Tree.is(group, Group)) {
				return [item, group];
			}

			return [item, undefined];
		}

		i++;
	}

	return [undefined, undefined];
}
