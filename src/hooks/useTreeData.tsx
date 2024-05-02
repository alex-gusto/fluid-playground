import type { TreeProps, TreeDataNode, MenuProps } from "antd";
import { Tree, type TreeView } from "fluid-framework";
import { type Items, NodeItem } from "../schemas";
import { useEffect, useState } from "react";

function fluidTreeToAntdTree(items: Items) {
	const newItems: TreeProps["treeData"] = [];
	let node: TreeDataNode & { menu: MenuProps["items"] };

	for (let item of items) {
		if (Tree.is(item, NodeItem)) {
			node = {
				title: item.data.title,
				key: item.id,
				menu: [
					{
						label: "Prepend",
						key: "prepend",
					},
					{
						label: "Insert",
						key: "insert",
					},
					{
						label: "Remove",
						key: "remove",
					},
				],
			};

			newItems.push(node);
			// @ts-expect-error
		} else if (node) {
			node.children = fluidTreeToAntdTree(item.items);
		}
	}

	return newItems;
}

export const useTreeData = (items: TreeView<typeof Items>) => {
	const [invalidations, setInvalidations] = useState(0);
	const [treeData, setTreeData] = useState<TreeProps["treeData"]>([]);

	useEffect(() => {
		setTreeData(fluidTreeToAntdTree(items.root));
	}, [invalidations]);

	useEffect(() => {
		const unsubscribe = Tree.on(items.root, "treeChanged", () => {
			// Leads to error if iterate items here
			setInvalidations(invalidations + Math.random());
		});

		return unsubscribe;
	}, []);

	return [treeData];
};
