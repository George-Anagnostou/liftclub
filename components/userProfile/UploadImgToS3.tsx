import React, { useState, useRef } from "react";
import AWS from "aws-sdk";
import styled from "styled-components";
// Utils
import { useStoreState } from "../../store";
import { saveProfileImgUrl } from "../../utils/api";
// Interface
import { User } from "../../utils/interfaces";

AWS.config.update({
  accessKeyId: String(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID),
  secretAccessKey: String(process.env.NEXT_PUBLIC_AWS_SECRET_KEY),
});

const myBucket = new AWS.S3({
  params: { Bucket: process.env.NEXT_PUBLIC_AWS_PROFILE_IMG_BUCKET },
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

type File = {
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: number;
};

interface Props {
  setProfileData: React.Dispatch<React.SetStateAction<User | null>>;
}

const UploadImgToS3: React.FC<Props> = ({ setProfileData }) => {
  const { user } = useStoreState();

  const savingCircle = useRef<SVGCircleElement>(null);

  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState("");
  const [savingImg, setSavingImg] = useState(false);

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is an image.
    if (file.type && !file.type.startsWith("image/")) {
      console.log("File is not an image.", file.type, file);
      return;
    }

    const url = URL.createObjectURL(file);
    setUploadedImage(url);

    setSelectedFile(file);
  };

  const uploadFile = (file: File | undefined) => {
    if (!file) return console.log("please upload a valid file");
    if (file.size > 1000000)
      return console.log(`file too large. This was ${file.size} Max file size is 1000000`);

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: "lift-club-profile-imgs",
      Key: user!.username,
    };

    setSavingImg(true);

    myBucket
      .putObject(params)
      .on("httpUploadProgress", async (e) => {
        if (savingCircle.current == null) return;

        const progressPct = Math.round((e.loaded / e.total) * 100);
        const circumference = 104 * Math.PI;

        savingCircle.current.style.strokeDasharray = `${circumference} ${circumference}`;
        savingCircle.current.style.strokeDashoffset = `${circumference}`;

        if (progressPct < 101 && progressPct > -1) {
          setProgress(progressPct);
        }

        function setProgress(percent: number) {
          const offset = circumference - (percent / 100) * circumference;
          savingCircle!.current!.style.strokeDashoffset = String(offset);
        }

        if (e.loaded === e.total) {
          setSavingImg(false);

          const profileImgUrl = `https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${
            user!.username
          }`;

          const saved = await saveProfileImgUrl(user!._id, profileImgUrl);
          if (saved) {
            setProfileData((prev) => prev && { ...prev, profileImgUrl: "" });
            setProfileData((prev) => prev && { ...prev, profileImgUrl });
          }
        }
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  return (
    <Container>
      <Icon>
        {savingImg && (
          <SavingIndicator className="progress-ring" height="120" width="120">
            <circle
              ref={savingCircle}
              className="progress-ring__circle"
              strokeWidth="4"
              fill="transparent"
              r="52"
              cx="60"
              cy="60"
            />
          </SavingIndicator>
        )}

        <input type="file" onChange={handleFileInput} />

        {uploadedImage ? (
          <img src={uploadedImage} alt="" />
        ) : (
          <PlusIcon>
            <span></span>
            <span></span>
          </PlusIcon>
        )}
      </Icon>

      <button onClick={() => uploadFile(selectedFile)}>Save</button>
    </Container>
  );
};

export default UploadImgToS3;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2.5rem;
`;

const Icon = styled.div`
  position: relative;
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  input {
    height: 100%;
    width: 100%;
    opacity: 0;
    position: absolute;
    z-index: 9;
  }
`;

const SavingIndicator = styled.svg`
  position: absolute;
  border-radius: 50%;

  .progress-ring__circle {
    stroke-dasharray: 0;
    transition: stroke-dashoffset 0.35s;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke: ${({ theme }) => theme.accentSoft};
  }
`;

const PlusIcon = styled.div`
  height: 100%;
  width: 100%;
  position: relative;

  span {
    position: absolute;
    bottom: 0px;
    right: 0;
    left: 0;
    top: 0;
    margin: auto;
    display: block;
    height: 3px;
    width: 30px;
    background: ${({ theme }) => theme.textLight};
    border-radius: 7px;

    &:first-of-type {
      transform: rotate(90deg);
    }
  }
`;
