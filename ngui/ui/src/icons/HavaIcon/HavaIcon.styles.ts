import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => ({
  icon: {
    boxShadow: "none",
    objectFit: "cover",
    objectPosition: "bottom"
  }
}));

export default useStyles;
