# bgp-viz

Consider this an artistic artifact: 
https://wibisono.github.io/bgp-viz/

With live top 20 ASn based on outgoing links counts:
https://wibisono.github.io/bgp-viz/dashboard

* Try hard refresh if the graph is sticky and not expanding live.
* Use 'w' to zoom in and 's' to zoom out.
* When the graph is at initial stage and it's not too crowded sometimes you can hover and see AS number of the node.
* Search functionality is not working yet.

Data source from RIS Live: https://ris-live.ripe.net/

Drawn using: https://github.com/anvaka/ngraph.pixel

Nodes are AS Numbers, edges are from announced PATH.

Prefix are still ignored, not drawn. No withdrawals.

# Building

```
npm install
npm run bundle
```

Serve this directory, it will start with two seed ASN and grow from there, after a while it might look like this:

![image](https://user-images.githubusercontent.com/566147/201327585-7e0840fb-7c31-4b56-8785-e49ff29083e4.png)
