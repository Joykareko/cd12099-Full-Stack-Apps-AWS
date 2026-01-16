import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware
app.use(bodyParser.json());

// GET /filteredimage?image_url={{URL}}
app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;

  // 1. Missing query parameter
  if (!image_url) {
    return res
      .status(400)
      .send("image_url query parameter is required");
  }

  try {
    // 2. Attempt to filter image
    const filteredPath = await filterImageFromURL(image_url);

    // 3. Success → 200 OK
    return res.status(200).sendFile(filteredPath, () => {
      deleteLocalFiles([filteredPath]);
    });

  } catch (error) {
    console.error(error);

    // 4. Invalid image or non-image URL
    return res
      .status(422)
      .send("Unable to process the provided image URL");
  }
});

// Root endpoint
app.get('/', async (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}');
});

// Start the server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log('press CTRL+C to stop server');
});
