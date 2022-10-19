# bgp-viz
Consider this an artistic artifact: 
https://wibisono.github.io/bgp-viz/

Experimental graph visualization of announced paths from RIS Live: https://ris-live.ripe.net/

Drawn using: https://github.com/anvaka/ngraph.pixel

Nodes are AS Numbers, edges are from announced PATH.

Prefix are still ignored, not drawn. No withdrawals.

# Building

```
npm install
npm run bundle
```

Serve this directory, it will start with two seed ASN and grow from there, after a while it might look like this:

<img width="653" alt="image" src="https://user-images.githubusercontent.com/566147/196793034-c6ff6f68-5a12-45b5-8028-68c254e9f142.png">
