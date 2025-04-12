import { Button } from "@mui/material";

interface Props {
  buttonLabel: string;
  children: JSX.Element;
  toggleVisibility: () => void;
  hideWhenVisible: { display: string };
  showWhenVisible: { display: string };
}

const Togglable = (props: Props) => {
  return (
    <div>
      <div style={props.hideWhenVisible}>
        <Button variant="contained" onClick={props.toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </div>
      <div style={props.showWhenVisible}>{props.children}</div>
    </div>
  );
};

export default Togglable;
