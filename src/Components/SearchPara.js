import React, { Component } from "react";


class SearchPara extends Component {
  state = { textToFind: "" };
  render() {
    return (
      <div>
        <label for="">Text To Find </label> <br />
        <textarea className="form-control"
        placeholder="Text To Find"

          cols="150"
          rows="5"
          name="textToFind"
          value={this.state.textToFind}
          onChange={(e) => this.setState({ textToFind: e.target.value })}
        ></textarea>
        <br />
        <div>
        {
            this.props.showFindText &&
          <button
            type="button"
            className="btn btn-primary btn-sm margin mx-2"
            onClick={() => this.props.handlerFindText(this.state.textToFind)}
          >
            Find For Me
          </button>
        }
          {
            !this.props.showFindText &&
          <button
            type="button"
            className="btn btn-primary btn-sm mx-2"
            onClick={() =>
              this.props.handlerFindSimilarParas(this.state.textToFind)
            }
          >
            Find List of Similar Paras
          </button>
          }
        </div>


        <hr />
        <div id="ForCollapseFunctionality">
       
        </div>
      </div> //end of main div
    );
  }
}

export default SearchPara;
