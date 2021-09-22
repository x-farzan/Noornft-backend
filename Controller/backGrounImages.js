const upload = require("../middleware/fileUpload");
const Image = require("../models/backGroundImages")
const Tags = require("../models/Tags")
const URL = `${process.env.HOST}/files/`;
const fs = require("fs");
const path = require("path")
require("dotenv").config();




// upload background image
const firstImageUpload = async (req, res) => {
    try {
      await upload(req, res);
  
  
  
      if (req.file == undefined) {
        console.log('file----', req.file)
        return res.status(400).send({ message: "Choose a file to upload" });
      }

      
      

  // const nameChnage = await   fs.rename(`../chimera-backend/public/uploads/${req.file.originalname}`, '../chimera-backend/public/uploads/image1.png', function (err) {
  //       if (err) throw err;
  //       console.log('File Renamed.');
  //     });

  
  
      res.status(200).send({
        message: "File uploaded successfully: " + req.file.originalname,

      });

      const pathToFile = path.join(__dirname, `../public/uploads/${req.file.originalname.toLowerCase().split(' ').join('-')}`)
      const newPathToFile = path.join(__dirname, "../public/uploads/image1.png")


      const Oldname = req.file.originalname.toLowerCase().split(' ').join('-')
      const nameChnage = fs.rename(pathToFile, newPathToFile, function (err) {
        if (err) throw err;
        console.log('File Renamed.');
      });



 




      const image = new Image({
          image1 : `${process.env.HOST}/uploads/image1.png`,
          name : "image"
    
        });


  

                 await image.save();
  
    } catch (err) {
      console.log(err);
  
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(500).send({
          message: "File size should be less than 500MB",
        });
      }
  
      res.status(500).send({
        message: `Error occured: ${err}`,
      });
    }
  };
  

//   upload 1st background image
  
const imageOneUpdation = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      console.log('file----', req.file)
      return res.status(400).send({ message: "Choose a file to upload" });
    }

console.log('file----1', req.file)

const pathToFile = path.join(__dirname, `../public/uploads/${req.file.originalname.toLowerCase().split(' ').join('-')}`)
const newPathToFile = path.join(__dirname, "../public/uploads/image1.png")


const Oldname = req.file.originalname.toLowerCase().split(' ').join('-')
const nameChnage = fs.rename(pathToFile, newPathToFile, function (err) {
  if (err) throw err;
  console.log('File Renamed.');
});



    var image = await Image.findOneAndUpdate({name :  "image"}, {

        image1 : `${process.env.HOST}/uploads/image1.png`,
})

              await image.save();

    console.log(req.body.tokenId);

    res.status(200).send({
      message: "image1 is updated successfully: " + req.file.originalname,
      
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 500MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};

// upload 2nd backgroudn image

const imageTwoUpdation = async (req, res) => {
    try {
        await upload(req, res);
    
    
    
        if (req.file == undefined) {
          console.log('file----', req.file)
          return res.status(400).send({ message: "Choose a file to upload" });
        }
    
    console.log('file----1', req.file)
    const pathToFile = path.join(__dirname, `../public/uploads/${req.file.originalname.toLowerCase().split(' ').join('-')}`)
    const newPathToFile = path.join(__dirname, "../public/uploads/image2.png")


    const Oldname = req.file.originalname.toLowerCase().split(' ').join('-')
    const nameChnage = fs.rename(pathToFile, newPathToFile, function (err) {
      if (err) throw err;
      console.log('File Renamed.');
    });

        var image = await Image.findOneAndUpdate({name :  "image"}, {
    
            image2 : `${process.env.HOST}/uploads/image2.png`,
    })
    
                   await image.save();
    
        console.log(req.body.tokenId);
    
        res.status(200).send({
          message: "image2 is updated successfully: " + req.file.originalname,
          
        });
      } catch (err) {
        console.log(err);
    
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(500).send({
            message: "File size should be less than 500MB",
          });
        }
    
        res.status(500).send({
          message: `Error occured: ${err}`,
        });
      }
  };

// upload 3rd backgroudn image

  const imageThreeUpdation = async (req, res) => {
    try {
        await upload(req, res);
    
    
    
        if (req.file == undefined) {
          console.log('file----', req.file)
          return res.status(400).send({ message: "Choose a file to upload" });
        }
    
        const pathToFile = path.join(__dirname, `../public/uploads/${req.file.originalname.toLowerCase().split(' ').join('-')}`)
        const newPathToFile = path.join(__dirname, "../public/uploads/image3.png")
  
  
        const Oldname = req.file.originalname.toLowerCase().split(' ').join('-')
        const nameChnage = fs.rename(pathToFile, newPathToFile, function (err) {
          if (err) throw err;
          console.log('File Renamed.');
        });
  
        var image = await Image.findOneAndUpdate({name :  "image"}, {
    
            image3 : `${process.env.HOST}/uploads/image3.png`,
    })
    
                   await image.save();
    
    
        res.status(200).send({
          message: "image3 is updated successfully " + req.file.originalname,
          
        });
      } catch (err) {
        console.log(err);
    
        if (err.code == "LIMIT_FILE_SIZE") {
          return res.status(500).send({
            message: "File size should be less than 500MB",
          });
        }
    
        res.status(500).send({
          message: `Error occured: ${err}`,
        });
      }
  };



  const getBackgroundImages = async (req, res) => {
    try {
      let image = await Image.findOne({name : "image"});
      
      if (!image) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'background images doesnt exist' }] });
        

        }
        else(
          res.status(200).send({
            image})
        )
    } catch (error) {
      res.status(500).send("server error")
    }

    }

module.exports = { imageOneUpdation, imageTwoUpdation, imageThreeUpdation, firstImageUpload, getBackgroundImages};