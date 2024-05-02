import { SchemaFactory, Tree, type ValidateRecursiveSchema } from "fluid-framework";

// The string passed to the SchemaFactory should be unique
const sf = new SchemaFactory("tree-schema");

// Here we define an object we'll use in the schema, a Dice.
export class NodeData extends sf.object("NodeData", {
	title: sf.string,
	value: sf.number,
}) {}

export class NodeItem extends sf.object("Node", {
	id: sf.string,
	data: NodeData,
}) {
	public delete() {
		const parent = Tree.parent(this);
		// Use type narrowing to ensure that parent is Items as expected for a note.
		if (Tree.is(parent, Items)) {
			const index = parent.indexOf(this);
			parent.removeAt(index);
		}
	}

	public insertChild() {
		const group = new Group({
			items: new Items([
				new NodeItem({
					id: crypto.randomUUID(),
					data: new NodeData({
						title: "Untitled node",
						value: 0,
					}),
				}),
			]),
		});

		const parent = Tree.parent(this);
		if (Tree.is(parent, Items)) {
			const index = parent.indexOf(this);
			parent.insertAt(index + 1, group);
		}
	}

	public prepend() {
		const parent = Tree.parent(this);

		if (Tree.is(parent, Items)) {
			const index = parent.indexOf(this);

			parent.insertAt(
				index + 1,
				new NodeItem({
					id: crypto.randomUUID(),
					data: new NodeData({
						title: "Untitled node",
						value: 0,
					}),
				}),
			);
		}
	}
}

export class Items extends sf.arrayRecursive("Items", [NodeItem, () => Group]) {
	public addNode() {
		// Define the note to add to the SharedTree - this must conform to
		// the schema definition of a note
		const newNote = new NodeItem({
			id: crypto.randomUUID(),
			data: new NodeData({ title: "New node", value: 10 }),
		});

		// Insert the note into the SharedTree.
		this.insertAtEnd(newNote);
	}

	public addGroup() {
		const group = new Group({
			items: new Items([]),
		});

		this.insertAtEnd(group);
		return group;
	}
}

export class Group extends sf.object("Group", {
	items: Items,
}) {
	public delete() {
		const parent = Tree.parent(this);
		console.log("delete", parent);
	}

	public insertChild() {
		this.items.insertAt(
			0,
			new NodeItem({
				id: crypto.randomUUID(),
				data: new NodeData({
					title: "Untitled node",
					value: 0,
				}),
			}),
		);
	}

	public prependSibling() {
		const parent = Tree.parent(this);

		if (Tree.is(parent, Items)) {
			const index = parent.indexOf(this);

			parent.insertAt(
				index + 1,
				new NodeItem({
					id: crypto.randomUUID(),
					data: new NodeData({
						title: "Untitled node",
						value: 0,
					}),
				}),
			);
		}
	}
}

{
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	type _check = ValidateRecursiveSchema<typeof Items>;
}
