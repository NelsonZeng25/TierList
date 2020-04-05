import { ThemeProvider } from "@material-ui/core";

const palette = {
  text: {
    primary: "#C5C6C7",
    primaryStrong: '#FFFFFF',
    secondary: "#000000",
  },
  primary: {
    light: "#1F2833",
    main: "#33333d",
    dark: "#0B0C17",
    contrastText: "#C5C6C7"
  },
  secondary: {
    light: "#62ecb0",
    main: "#66FCF1",
    dark: "#16c8be",
    contrastText: "#000000"
  }
}

// primary: {
//   light: "#424250",
//   main: "#33333d",
//   dark: "#0c0c17",
//   contrastText: "#ffffff"
// },
// secondary: {
//   light: "#62ecb0",
//   main: "#1eb980",
//   dark: "#008853",
//   contrastText: "#000000"
// }

export default {
  palette,
  spreadThis: {
    typography: {
      useNextVariant: true
    },
    form: {
      textAlign: "center",
      paddingRight: '5rem',
      "@media (max-width:600px)": {
        paddingRight: 0,
      }
    },
    itemGrid: {
      margin: '0 auto',
      maxWidth: '300px',
    },
    inputIcon: {
      marginTop: '-16px',
      backgroundColor: palette.primary.main,
      width: '1.3rem',
      height: '1.3rem',
      padding: '15px',
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
      margin: "0.5rem auto 0.5rem auto",
      "& p": {
        marginLeft: 'auto',
        marginRight: 'auto',
      }
    },
    button: {
      marginTop: "1rem",
      position: "relative",
      width: '100%',
      height: '2.8rem',
    },
    cssInput: {
      paddingLeft: 0,
      "& input": {
          padding: '16px 12px 16px 10px'
      },
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
      margin: '4px',
      height: 'min-content',
    },
    visibleSeperator: {
      width: '100%',
      borderBottom: '1px solid rgb(0,0,0, 0.1)',
      marginBottom: '20px',
      height: 'min-content',
    },
    commentButton: {
      padding: '5px 5px 5px 10px',
      marginLeft: '15px',
    },
    pageName: {
      textAlign: 'center',
      textDecoration: 'underline',
      overflowWrap: 'break-word',
      maxWidth: '100%',
      marginTop: '20px',
      color: palette.text.primaryStrong,
    },
    paper: {
      background: palette.primary.main,
      maxWidth: '290px',
      minWidth: '19%',
      padding: '15px',
      margin: '20px auto 0px auto',
      position: 'relative',
      "@media (max-width:1200px)": {
        position: 'relative',
      }
    },
    profile: {
      "& .image-wrapper": {
        textAlign: "center",
        position: "relative",
        "& button": {
          position: "absolute",
          top: "80%",
          left: "73%"
        }
      },
      "& .profile-image": {
        width: 200,
        height: 200,
        objectFit: "cover",
        borderRadius: "50%",
        border: `4px solid ${palette.primary.contrastText}`,
      },
      "& .profile-details": {
        textAlign: "center",
        "& span": {
          color: palette.primary.contrastText
        },
        "& span, svg": {
          verticalAlign: "middle"
        },
        "& .website": {
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
