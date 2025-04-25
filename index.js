const { addonBuilder } = require("stremio-addon-sdk");

const manifest = {
  id: "org.kanale.shqip",
  version: "1.0.0",
  name: "Kanale Shqip",
  description: "Addon with Albanian live channels",
  resources: ["catalog", "stream"],
  types: ["tv"],
  catalogs: [
    { type: "tv", id: "kanale_shqip_catalog_gjenerale" },
    { type: "tv", id: "kanale_shqip_catalog_kombetare" },
    { type: "tv", id: "kanale_shqip_catalog_filma" },
    { type: "tv", id: "kanale_shqip_catalog_sport" },
    { type: "tv", id: "kanale_shqip_catalog_tehuaj" }
  ],
  idPrefixes: ["kanale_"],
};

const streams = {
  "kanale_klan": { title: "Klan", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261956.m3u8", category: "kanale_shqip_catalog_gjenerale" },
  "kanale_topchannel": { title: "Top Channel", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261954.m3u8", category: "kanale_shqip_catalog_gjenerale" },
  "kanale_rtsh1": { title: "RTSH 1", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261964.m3u8", category: "kanale_shqip_catalog_kombetare" },
  "kanale_rtsh2": { title: "RTSH 2", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/261965.m3u8", category: "kanale_shqip_catalog_kombetare" },
  "kanale_aksion": { title: "Film Aksion", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262027.m3u8", category: "kanale_shqip_catalog_filma" },
  "kanale_tringsuper": { title: "Tring Super", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262039.m3u8", category: "kanale_shqip_catalog_filma" },
  "kanale_supersport2": { title: "Super Sport 2", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262222.m3u8", category: "kanale_shqip_catalog_sport" },
  "kanale_tringsport1": { title: "Tring Sport 1", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262243.m3u8", category: "kanale_shqip_catalog_sport" },
  "kanale_natgeo": { title: "National Geographic HD", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262189.m3u8", category: "kanale_shqip_catalog_tehuaj" },
  "kanale_discovery": { title: "Discovery Channel HD", url: "http://a1.lion.wine:80/live/x9Kw7670/8cxU9044/262191.m3u8", category: "kanale_shqip_catalog_tehuaj" },
};

const builder = new addonBuilder(manifest);

builder.defineCatalogHandler(() => {
  const metas = Object.entries(streams).map(([id, stream]) => ({
    id,
    type: "tv",
    name: stream.title,
    poster: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/TV_icon_2.svg/600px-TV_icon_2.svg.png",
    catalog: stream.category
  }));
  return Promise.resolve({ metas });
});

builder.defineStreamHandler(({ id }) => {
  const stream = streams[id];
  return Promise.resolve({ streams: stream ? [{ title: stream.title, url: stream.url }] : [] });
});

module.exports = builder.getInterface();
const express = require("express");
const app = express();

app.get('/', (req, res) => {
  res.send('Welcome to the Kanale Shqip Addon!');
});


app.get("/manifest.json", (req, res) => {
  res.json(builder.getInterface().manifest);
});

app.get("/catalog/:type/:id.json", async (req, res) => {
  const { metas } = await builder.getInterface().get("catalog", req.params);
  res.json({ metas });
});

app.get("/stream/:type/:id.json", async (req, res) => {
  const { streams } = await builder.getInterface().get("stream", req.params);
  res.json({ streams });
});

const server = require('http').createServer(app); 

const port = process.env.PORT || 10000;
server.listen(port, () => {
  console.log(`✅ Server is running at http://0.0.0.0:${port}/manifest.json`);
});
