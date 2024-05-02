import { Group, Items, NodeData, NodeItem } from "./schemas";

type Model = {
	_id: string;
	area: string;
	data: {
		text: string;
	};
	children?: Model[];
};

export function map(nodes: Model[]) {
	const items: (NodeItem | Group)[] = [];

	nodes.forEach((node) => {
		items.push(
			new NodeItem({
				id: node._id,
				data: new NodeData({
					title: node.data.text,
					value: 0,
				}),
			}),
		);

		if (node.children && node.children.length > 0) {
			items.push(
				new Group({
					items: map(node.children),
				}),
			);
		}
	});

	return new Items(items);
}
