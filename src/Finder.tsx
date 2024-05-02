import { Tree, type TreeView } from "fluid-framework";
import { Group, NodeItem, type Items } from "./schemas";
import { Button, Tree as AntTree, Dropdown, type MenuProps, type TreeDataNode } from "antd";
import { useEffect, useState } from "react";
import type { EventDataNode, TreeProps } from "antd/es/tree";
import { useNavigate, useParams } from "react-router-dom";
import { findNode } from "./utils";
import type { FluidContainer } from "./start-fluid";
import { useTreeData } from "./hooks";

type AppProps = {
	items: TreeView<typeof Items>;
	container: FluidContainer;
};

export function Finder({ items }: AppProps) {
	const { area, id } = useParams();
	const navigate = useNavigate();
	const [menu, setMenu] = useState<MenuProps>({ items: [] });
	const [treeData] = useTreeData(items);

	const prependNode = (id: string) => {
		const [node, group] = findNode(items.root, id);

		if (group) {
			group.prependSibling();
		} else if (node) {
			node.prepend();
		}
	};

	const removeNode = (id: string) => {
		const [node] = findNode(items.root, id);
		if (node) {
			node.delete();
		}
	};

	const insertNode = (id: string) => {
		const [node, group] = findNode(items.root, id);

		if (group) {
			group.insertChild();
		} else if (node) {
			node.insertChild();
		}
	};

	const onClickNode: TreeProps["onClick"] = (e, node) => {
		navigate(`/${area}/${node.key}`);
	};

	const onMenuClick = (key: string, node: EventDataNode<{}>) => {
		if (key === "remove") {
			removeNode(`${node.key}`);
		}

		if (key === "prepend") {
			prependNode(`${node.key}`);
		}

		if (key === "insert") {
			insertNode(`${node.key}`);
		}
	};

	const onRightClick: TreeProps["onRightClick"] = ({ node }) => {
		// @ts-expect-error
		setMenu({ items: node.menu, onClick: ({ key }) => onMenuClick(key, node) });
	};

	return (
		<Dropdown menu={menu} trigger={["contextMenu"]}>
			<AntTree
				className="h-100"
				selectedKeys={id ? [id] : []}
				showLine
				treeData={treeData}
				onClick={onClickNode}
				onRightClick={onRightClick}
			/>
		</Dropdown>
	);
}
