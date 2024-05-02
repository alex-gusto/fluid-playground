/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { App as ReactApp } from "./App";

const rootEl = document.getElementById("content");

if (!rootEl) throw new Error("No root el");

// Render your React component instead
const root = createRoot(rootEl);
root.render(createElement(ReactApp));
