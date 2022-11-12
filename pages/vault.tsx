import { GetServerSideProps, NextPage } from "next";
import {Box, Button, Grid, ImageList, ImageListItem, Modal, Typography} from "@mui/material";
import { useState } from "react";
import { style } from "@mui/system";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 800,
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

type Image = {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
};

type PageProps = {
  firstHundredImages: Image[];
};

const IMAGES_API_LINK = "https://jsonplaceholder.typicode.com/photos";

const Vault: NextPage<PageProps> = ({ firstHundredImages }) => {
  const [selectedImage, setSelectedImage] = useState<Image>(firstHundredImages[0]);
  const [openModal, setOpenModal] = useState(false);

    const handleOpen = (image: Image) => {
        setSelectedImage(image);
        setOpenModal(true);
    }

    const handleClose = () => {
        setOpenModal(false);
    }

  //make a responsive grid of square images using the items from itemData
  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <ImageList variant="masonry" cols={1} gap={1}>
            {firstHundredImages.map((image) => (
              <ImageListItem key={image.id} onClick={() => handleOpen(image)}>
                <img
                  src={`${image.thumbnailUrl}?w=1000&h=1000&fit=crop&auto=format`}
                  srcSet={`${image.thumbnailUrl}?w=500&h=500&fit=crop&auto=format&dpr=2 2x`}
                  alt={image.title}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
      </Grid>
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
        >
            <Box sx={modalStyle} display={"flex"} flexDirection={"column"}>
                <Typography id="parent-modal-title" variant={"h3"} textAlign={"center"}>{selectedImage.title}</Typography>
                <img src={selectedImage.url} alt={selectedImage.title} />
                <Button onClick={handleClose} variant={"contained"} sx={{marginTop:"10px"}}>Close</Button>
            </Box>
        </Modal>
    </>
  );
};



export default Vault;

export const getServerSideProps: GetServerSideProps = async () => {
  const imagesResponse = await fetch(IMAGES_API_LINK);
  const images = await imagesResponse.json();
  console.log(images);
  const firstHundredImages = images.slice(0, 100);

  return {
    props: {
      firstHundredImages,
    },
  };
};
