import React, { useState, useRef } from "react";
import { config, S3 } from "aws-sdk";
import styled from "styled-components";
// Utils
import { useUserState } from "../../store";
import { saveProfileImgUrl } from "../../utils/api";
// Interface
import { User } from "../../utils/interfaces";

// AWS
config.update({
  accessKeyId: String(process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID),
  secretAccessKey: String(process.env.NEXT_PUBLIC_AWS_SECRET_KEY),
});
// AWS
const myBucket = new S3({
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
  const { user } = useUserState();

  const savingCircle = useRef<SVGCircleElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [savingImg, setSavingImg] = useState(false);

  const clearInput = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setSavingImg(false);
  };

  const handleFileInput = (e) => {
    const file: File | null = e.target.files[0];
    if (!file) return;

    if (file.size > 3000000)
      return console.log(`File too large. This was ${file.size} Max file size is 3mb`);

    setSelectedFile(file);

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
  };

  const uploadFile = (file: File | null) => {
    if (!file) return console.log("Please upload a valid file");

    console.log(file);

    const fileType = file.type.split("/")[1];

    const params = {
      ACL: "public-read",
      Body: file,
      Bucket: "lift-club-profile-imgs",
      Key: user!.username + "." + fileType,
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

        function setProgress(percent: number) {
          const offset = circumference - (percent / 100) * circumference;
          savingCircle!.current!.style.strokeDashoffset = String(offset);
        }

        if (progressPct < 101 && progressPct > -1) {
          setProgress(progressPct);
        }

        if (e.loaded >= e.total) {
          setSavingImg(false);

          const profileImgUrl = `https://lift-club-profile-imgs.s3.us-west-1.amazonaws.com/${
            user!.username
          }.${fileType}`;

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
      <h3 className="title">Change your profile image</h3>
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

        <FileInput type="file" accept="image/*" onChange={handleFileInput} />

        {previewUrl ? (
          <PreviewImg src={previewUrl} alt="Uploaded Profile Image" />
        ) : (
          <PlusIcon>
            <span></span>
            <span></span>
          </PlusIcon>
        )}
      </Icon>

      <p className="info">Max image size 3MB</p>

      <div className="btn-container">
        <button onClick={() => uploadFile(selectedFile)} disabled={!selectedFile}>
          Save
        </button>
        <button onClick={clearInput} disabled={!selectedFile}>
          Clear
        </button>
      </div>
    </Container>
  );
};

export default UploadImgToS3;

const Icon = styled.div`
  position: relative;
  background: ${({ theme }) => theme.buttonMed};
  border: 3px solid ${({ theme }) => theme.buttonMed};
  height: 100px;
  width: 100px;
  border-radius: 50%;
  margin-right: 0.5rem;

  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;
`;

const PreviewImg = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
`;

const FileInput = styled.input`
  height: 100%;
  width: 100%;
  opacity: 0;
  position: absolute;
  z-index: 9;
  cursor: pointer;
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

const Container = styled.div`
  padding: 0.5rem 0.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .info {
    width: fit-content;
    font-size: 75%;
    color: ${({ theme }) => theme.textLight};
    margin: 0.5rem;
  }

  .btn-container {
    display: flex;

    button {
      background: ${({ theme }) => theme.buttonMed};
      box-shadow: 0 1px 2px ${({ theme }) => theme.boxShadow};
      color: inherit;
      border: none;
      border-radius: 5px;
      padding: 0.25rem 0.5rem;
      margin: 0 0.5rem;
      border: 1px solid ${({ theme }) => theme.border};
      font-size: 1rem;
      transition: all 0.3s ease;

      &:disabled {
        color: ${({ theme }) => theme.border};
        background: ${({ theme }) => theme.background};
        border: 1px solid ${({ theme }) => theme.buttonLight};
      }
    }
  }
`;
