# bgp-viz

An expanding artistic impressions of live AS topology graph: 
https://wibisono.github.io/bgp-viz/



With live top 20 ASn based on outgoing links counts:
https://wibisono.github.io/bgp-viz/dashboard

* Data source from RIS Live: https://ris-live.ripe.net/
* Drawn using: https://github.com/anvaka/ngraph.pixel
* Nodes are AS Numbers, edges are from announced PATH.
* Prefix are still ignored, not drawn. No withdrawals.
* Edge color might indicate that red one is provider of the blue one.

# Building

```
npm install
npm run bundle
```

Serve this directory, it will start with two seed ASN with large cone from: https://asrank.caida.org/

After a while dashboard might look like this.

![image](https://user-images.githubusercontent.com/566147/201361388-2817c114-5d05-4699-9a5b-b2797b334673.png)


* Try hard refresh if the graph is sticky and not expanding live.
* Use 'w' to zoom in and 's' to zoom out.
* When the graph is at initial stage and it's not too crowded sometimes you can hover and see AS number of the node.
* Search functionality is not working yet.


