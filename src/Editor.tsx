import { Form, Input, InputNumber, type FormProps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { findNode } from "./utils";
import type { Items, NodeData } from "./schemas";
import { Tree, type TreeView } from "fluid-framework";
import debounce from "lodash.debounce";

type EditorProps = {
	id?: string;
	items: TreeView<typeof Items>;
};

export function Editor({ id, items }: EditorProps) {
	const [node, setNode] = useState<NodeData | undefined>();
	const [form] = Form.useForm();

	useEffect(() => {
		if (!id) return;
		const [node] = findNode(items.root, id);
		setNode(node?.data);

		// TODO: subscribe to specific node
		const unsubscribe = Tree.on(items.root, "nodeChanged", () => {
			const [node] = findNode(items.root, id);
			setNode(node?.data);
		});

		return unsubscribe;
	}, [id]);

	useEffect(() => {
		if (node) {
			form.setFieldsValue(node);
		}
	}, [node]);

	const onValuesChange = useCallback<NonNullable<FormProps["onValuesChange"]>>(
		debounce((e) => {
			if (!node) return;

			Object.entries(e).forEach(([label, value]) => {
				// @ts-expect-error Type Object.entries
				node?.[label] = value;
			});
		}, 500),
		[node],
	);

	return (
		<Form form={form} onValuesChange={onValuesChange} layout="vertical">
			<Form.Item name="title" label="Title">
				<Input />
			</Form.Item>

			<Form.Item name="value" label="Value">
				<InputNumber />
			</Form.Item>
		</Form>
	);
}
