import { ThemeProvider } from "@material-ui/core";

const palette = {
  text: {
    primary: "#ffffff",
    secondary: "#000000",
  },
  primary: {
    light: "#424250",
    main: "#33333d",
    dark: "#0c0c17",
    contrastText: "#ffffff"
  },
  secondary: {
    light: "#62ecb0",
    main: "#1eb980",
    dark: "#008853",
    contrastText: "#000000"
  }
}

export default {
  palette,
  spreadThis: {
    typography: {
      useNextVariant: true
    },
    form: {
      marginLeft: '-5%',
      textAlign: "center"
    },
    image: {
      margin: "1rem auto 1rem auto",
      maxWidth: "5rem"
    },
    pageTitle: {
      color: palette.primary.contrastText,
      margin: "0.5rem auto 0.5rem auto"
    },
    textField: {
      margin: "0.5rem auto 0.5rem auto"
    },
    button: {
      marginTop: "1rem",
      position: "relative"
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: "0.5rem"
    },
    progress: {
      position: "absolute"
    },
    login_signup_text: {
      color: palette.primary.contrastText,
      marginTop: "1rem"
    },
    login_signup_link: {
      color: palette.secondary.main,
      textDecoration: 'inherit',
    },
    invisibleSeperator: {
      border: 'none',
      margin: '4px'
    },
    visibleSeperator: {
      width: '100%',
      borderBottom: '1px solid rgb(0,0,0, 0.1)',
      marginBottom: '20px',
    },
    paper: {
      background: palette.primary.dark,
      padding: 20
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "70%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        maxWidth: "100%",
        borderRadius: "50%",
        border: '4px solid white'
      },
      "& .profile-details": {
        textAlign: "center",
        "& span": {
          color: palette.primary.contrastText
        },
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& a": {
          color: palette.primary.contrastText
        }
      },
      "& hr": {
        border: "none",
        margin: "0 0 10px 0"
      },
      "& svg.button": {
        "&:hover": {
          cursor: "pointer"
        }
      }
    },
    buttons: {
      textAlign: "center",
      "& a": {
        margin: "20px 10px"
      }
    }
  }
};
