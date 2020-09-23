
import React, { Component } from 'react';
import SearchPara from './Components/SearchPara';
import { Accordion, Card, Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from './Components/FirebaseConfig';

class App extends Component {
  state = {
    textToFind: "",
    foundText: "",
    targetTextPortugues: "",
    srcTextEng: "",
    srcTextEngToAddInMemoryBank:"",
    targertTextEng: "",
    comparedTextResult: "",
    srcTextEngArray: [],
    targetTextEngArray: [],
    similarParaList: [],
    paraList: [],
    paraListTest: "",
    // paraList: [
    //   {
    //     id: 0,
    //     text:
    //       "Dr. Miguel Fernández Department of Linguistics Applied Science and Technology, Higher Technical School  Building, Polytechnic University of MadridAvda. Juan de Herrera nº 6 28040 Madrid.",
    //     textPortugues: "",
    //   },
    //   {
    //     id: 1,
    //     text:
    //       "Dr. Arezou Zalipour School of Language Studies and Linguistics Faculty of Social Sciences and Humanities National University of Malaysia (UKM)  Selangor,  Malaysia.",
    //     textPortugues: "",
    //   },
    //   {
    //     id: 2,
    //     text:
    //       "Dr. Gabriel Julien Research Supervisor University of the West Indies St. Augustine, Trinidad and Tobago",
    //     textPortugues:
    //       "Dr. Gabriel Julien Supervisor de Pesquisa Universidade das Índias Ocidentais Santo Agostinho, Trinidad e Tobago",
    //   },],


    }

    handlerConverStringToArray = () => {
      this.setState({
        srcTextEngArray: this.state.srcTextEng.split(" "),
        targetTextEngArray: this.state.targertTextEng.split(" "),
      });
    };
    handlerComparesion = () => {
      if (this.state.srcTextEng !== "" && this.state.targertTextEng !== "") {
       
        this.setState({ comparedTextResult: this.returnComparedText() });
      }
    };
    returnComparedText() {
      const srcTextToCompareArray = this.state.srcTextEng.split(" ");
      let targetTextToCompareArray = this.state.targertTextEng.split(" ");
      let result = [];
  
      result.push(
        srcTextToCompareArray.map((i) =>
          targetTextToCompareArray.includes(i) ? i : i.italics()
        )
      );
      let finalResult = result.join(" ");
      
      finalResult = finalResult.replace(/,/g, " ");
      return finalResult;
    }
    handlerFindText = (searchText) => {
      // console.log(this.state.paraList);
  
      const newList = this.state.paraList.filter(
        (i) => JSON.stringify(i.text.trim()) === JSON.stringify(searchText.trim())
      );
  
      newList.length <= 0
        ? alert("Record Not Found")
        : this.setState({ foundText: newList[0].textPortugues });
    };
      isParaSimilar = (srcArray,targetArray) => {
        let noOfDifferentWords =0;
        let noOfSimilarWords =0;
  
        let lengthDifferenceInArrays=(srcArray.length-targetArray.length>0) ? srcArray.length-targetArray.length :targetArray.length-srcArray.length
        
     
         if(lengthDifferenceInArrays<=10)
         {
           for (let ii=0;ii<srcArray.length;ii++)
           {
           
             (srcArray[ii]===targetArray[ii]) ? noOfSimilarWords++ : noOfDifferentWords++ ;
           }
           if (noOfSimilarWords>=4){
            alert(srcArray.toString());
            return true;
           } 
          
         }
         
         return false;
     }
    handlerFindSimilarParas = (searchPara) => {
      const searchParaArray = searchPara.split(" ");
      
      const similarParaList = [];
      let targetArray = [];
      this.state.paraList.map((i)=> {
        targetArray = i.text.split(" ") ;
        let isAddPara = this.isParaSimilar(searchParaArray,targetArray);
        // alert(isAddPara);
       if(isAddPara){
         alert(`found para =${targetArray.toString()}`);
         similarParaList.push(i);}
      });
  
     
  
      this.setState({ similarParaList });
      similarParaList.length > 0
        ? alert("Similar Para List Is availabel")
        : alert("No Similar Para Found");
     
    };


    handlerAddToMemory = e =>{
      const {srcTextEngToAddInMemoryBank,targetTextPortugues,id} = this.state;
      firebase.database().ref('Paras').push({
        
          text:srcTextEngToAddInMemoryBank,
          textPortugues:targetTextPortugues
        });
        this.setState({srcTextEngToAddInMemoryBank:'',targetTextPortugues:''});
    }//end of handlerAddToMemory

    handlerLoadData = _ =>{
      
        firebase.database()
        .ref("Paras")
        .on("value",
        snapShot => {
          let paraList = [];
          snapShot.forEach(
            p => {paraList.push({id:p.key,...p.val()})});
            this.setState({paraList});
           
            // console.log(this.state.paraList);
        });

       
      }
        
    
    

componentDidMount(){
  this.handlerLoadData();
  
  
}
    render() { 
    //  console.log(this.state.paraList);
    const srcEng = this.state.srcTextEngArray.map((i) => {
      return this.state.targetTextEngArray.includes(i) ? (
        i + " "
      ) : (
        <space style={{ color: "red" }}>
          <b>{i+ " "}</b>
        </space>
      );
    });

    const targetEng = this.state.targetTextEngArray.map((i) => {
      return this.state.srcTextEngArray.includes(i) ? (
        i + " "
      ) :  (
        <space style={{ color: "red" }}>
          <b>{i + " "}</b>
        </space>
      );
    });
    return (
    //////////////Exported Code Start
    <div>

        <div className="App">
        
          <Accordion defaultActiveKey="5">
        
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Find Paragraphs
              </Accordion.Toggle>
            </Card.Header>
        
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                    <SearchPara
                      handlerFindText={this.handlerFindText}
                      handlerFindSimilarParas={this.handlerFindSimilarParas}
                      showFindText={true}
                    />
                    <div id="por">{this.state.foundText}</div>
                
        
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="1">
                Find Similars Paragraphs
              </Accordion.Toggle>
            </Card.Header>
        
            <Accordion.Collapse eventKey="1">
              <Card.Body>
              <SearchPara
                      handlerFindText={this.handlerFindText}
                      handlerFindSimilarParas={this.handlerFindSimilarParas}
                      showFindText={false}
                    />
                    <div id="similarPara">
                    <ul>
                      {this.state.similarParaList.map((spl) => (
                        <li key={spl.id}>{spl.text}</li>
                      ))}
                    </ul>
                  </div>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="2">
              Compare Paras
              </Accordion.Toggle>
            </Card.Header>
        
            <Accordion.Collapse eventKey="2">
              <Card.Body>
            
                    <label>Source Text In English</label>
                    <br />
                    <textarea className="form-control"
                    placeholder="Source Text In English"
                      name="srcTextEng"
                      id=""
                      cols="150"
                      rows="10"
                      value={this.state.srcTextEng}
                      onChange={(e) => {
                        this.setState({ srcTextEng: e.target.value });
                      }}
                    ></textarea>
                    <br />
                    <hr />
        
                    <label>Target Text In English</label>
                    <br />
                    <textarea className="form-control"
                    placeholder="Target Text In English"
                      name="targertTextEng"
                      id=""
                      cols="150"
                      rows="10"
                      value={this.state.targertTextEng}
                      onChange={(e) => {
                        this.setState({ targertTextEng: e.target.value });
                      }}
                    ></textarea>
                  <hr/>
                  <button
                    className="btn btn-primary"
                    onClick={this.handlerConverStringToArray}
                  >
                    Show Difference
                  </button>
        
                  <div
                    style={{
                      width: "600px",
                      wordWrap: "break-word",
                      textTransform: "capitalize",
                      backgroundColor:"#f2e4f5",borderRadius:"25px",padding:"5px" 
                    }}
                  >
                    <h5>Source text</h5>
        
                    {srcEng}
                  </div>
                      <hr/>
                  <div
                    style={{
                      width: "600px",
                      wordWrap: "break-word",
                      textTransform: "capitalize",
                      backgroundColor:"#ede9ce",borderRadius:"25px",padding:"5px" 
                    }}
                  >
                    <h5>Target text</h5>
                    {targetEng}
                  </div>
                  
                    <div>{this.state.comparedTextResult}</div>
        
                    
                    
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        
          <Card>
            <Card.Header>
              <Accordion.Toggle as={Button} variant="link" eventKey="3">
              Add To Data Bank
              </Accordion.Toggle>
            </Card.Header>
        
            <Accordion.Collapse eventKey="3">
              <Card.Body>
              <label>Text In English</label>
              <textarea className="form-control"
                    placeholder="Source Text In English"
                      name="srcTextEngToAddInMemoryBank"
                      id=""
                      cols="150"
                      rows="10"
                      value={this.state.srcTextEngToAddInMemoryBank}
                      onChange={(e) => {
                        this.setState({ srcTextEngToAddInMemoryBank: e.target.value });
                      }}
                    ></textarea>
                    <br />
                  
              <label>Translated Text in Portugues</label>
                    <br />
                    <textarea className="form-control"
                      placeholder="Translated Text in Portugues"
                      name="targetTextPortugues"
                      id=""
                      cols="150"
                      rows="10"
                      value={this.state.targetTextPortugues}
                      onChange={(e) => {
                        this.setState({ targetTextPortugues: e.target.value });
                      }}
                    ></textarea>
                    <br />
                    <button  className="btn btn-primary" onClick={this.handlerAddToMemory}>
                      Add to Memory Bank
                    </button>
                  
        
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        
        </Accordion>
        
        </div>
        {/* <button onClick={()=>console.log(this.state.paraList)}>Show List</button> */}
    </div>
        );
         //////////////Exported Code End
 
      }
    }
   
 
export default App;