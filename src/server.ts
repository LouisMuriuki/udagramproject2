import express, { response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request } from 'express';
import { Response } from 'express';
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/", (req:Request, res:Response) => {
    res.status(200).send("Server is up and running, you can pass any image url");
  })

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user ?image_url={{}}
  app.get("/filteredimage", async (req:Request, res:Response) => {

     //    1. validate the image_url query
    let { image_url }:{image_url:string} = req.query.image_url

    try {
      if (!image_url) {
        res.status(400).send("image url is required")
      }
      //    2. call filterImageFromURL(image_url) to filter the image
      const imagePath: string = await filterImageFromURL(image_url)
      console.log(imagePath)

      //    3. send the resulting file in the response
      res.status(200).sendFile(imagePath)
      //    4. deletes any files on the server on finish of the response
      res.on('finish', () => deleteLocalFiles([imagePath]))
    } catch (error) {
      res.status(422).send("image cannot be processed")
    }

  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();