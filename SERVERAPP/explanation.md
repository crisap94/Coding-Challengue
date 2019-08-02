**BRIEF EXPLANATION**

Library used ChartJS

Function randomData() create random data used to feed the Sum Server.

Then the Plotting function which sets the chart's type.

Then comes the refresh interval set to 1 second and handling the visualization up to 20 maximum data points avoiding the labels to overlap.

**ARCHITECTURE AND DEPLOYMENT**

As it is a simple SPA (Single Page Application) doesn't have any kind of well-known architecture implemented, it consists of a simply embedded javascript code into an HTML page.

To be able to deploy it, just need a browser with javascript enabled and an internet connection, because it needs to get the CDN for the chart library.

*So, to RUN it just open it in the browser.*

The client creates the data, the server process it and send the sum back to the client after 1 second.
The client makes a graph out of it.