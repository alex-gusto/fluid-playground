import { SharedTree, TreeConfiguration, type IFluidContainer } from "fluid-framework";
import { TinyliciousClient as Client } from "@fluidframework/tinylicious-client";
import { initializeDevtools, createDevtoolsLogger } from "@fluidframework/devtools";
import { Items } from "./schemas";
import { map } from "./project.loader";

const devtoolsLogger = createDevtoolsLogger();

const client = new Client({
	connection: {
		port: 7071,
	},
	logger: devtoolsLogger,
});

const containerSchema = {
	initialObjects: { appTree: SharedTree },
};

export type FluidContainer = IFluidContainer<typeof containerSchema>;

const loadOrCreateContainer = async (id?: string) => {
	if (id) {
		return client.getContainer(id, containerSchema);
	}

	return await client.createContainer(containerSchema);
};

export async function start(containerId?: string) {
	const project = await import("./simple-project.json");

	const { container, services } = await loadOrCreateContainer(containerId);
	const appTree = container.initialObjects.appTree.schematize(
		new TreeConfiguration(Items, () => map([project])),
	);

	initializeDevtools({
		logger: devtoolsLogger,
		initialContainers: [
			{
				container,
				containerKey: "main",
			},
		],
	});

	return {
		container,
		services,
		appTree,
	};
}
