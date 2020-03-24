const palette = {
  primary: {
    light: "#718792",
    main: "#455a64",
    dark: "#1c313a",
    contrastText: "#ffffff"
  },
  secondary: {
    light: "#b2fef7",
    main: "#80cbc4",
    dark: "#4f9a94",
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
      textAlign: "center"
    },
    image: {
      margin: "1rem auto 1rem auto",
      maxWidth: "5rem"
    },
    pageTitle: {
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
      marginTop: "1rem"
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
      background: palette.primary.light,
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
