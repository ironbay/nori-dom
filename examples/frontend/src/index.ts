import { Connection } from "@ironbay/riptide";
import * as Nori from "@ironbay/nori";

// Create a connection to the remote server
const connection = Connection.create();
connection.transport.connect("ws://localhost:12000/socket");

Nori.render(connection, document.querySelector("#root"));
