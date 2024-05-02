import { Badge, Col, Layout, Row, Spin } from "antd";
import { Finder } from "./Finder";
import { useEffect, useRef, useState } from "react";
import { start, type FluidContainer } from "./start-fluid";
import { useNavigate, useParams } from "react-router-dom";
import type { TreeView } from "fluid-framework";
import type { TinyliciousContainerServices as Services } from "@fluidframework/tinylicious-client";
import type { Items } from "./schemas";
import { Editor } from "./Editor";

const { Content, Header } = Layout;

export function Home() {
	const { area, id } = useParams();
	const navigate = useNavigate();
	const [fluid, setFluid] = useState<{
		container: FluidContainer;
		services: Services;
		appTree: TreeView<typeof Items>;
	}>();

	const [saved, setSaved] = useState(true);

	useEffect(() => {
		start(area)
			.then(async ({ container, services, appTree }) => {
				if (!area) {
					const id = await container.attach();
					navigate(`/${id}`);
				}

				setFluid({ container, services, appTree });
			})
			.catch(console.error);
	}, []);

	useEffect(() => {
		if (!fluid) return;
		const { container } = fluid;

		setSaved(!container.isDirty);
		container.on("dirty", () => setSaved(false));
		container.on("saved", () => setSaved(true));
	}, [fluid]);

	return (
		<Layout className="h-100">
			<Header>
				<Badge status={saved ? "success" : "warning"} />
			</Header>

			{!area || !fluid ? (
				<Spin style={{ margin: "auto" }} />
			) : (
				<Content style={{ padding: "8px 16px" }}>
					<Row gutter={16} className="h-100">
						<Col span={8}>
							<Finder items={fluid.appTree} container={fluid.container} />
						</Col>
						<Col span={16}>
							<Editor items={fluid.appTree} id={id} />
						</Col>
					</Row>
				</Content>
			)}
		</Layout>
	);
}
