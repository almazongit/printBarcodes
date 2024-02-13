import React, { useState, useRef } from 'react';
import { useBarcode } from 'next-barcode';
import QRCode from 'qrcode.react'
import DataMatrix from 'react-datamatrix-svg';
import {useReactToPrint} from 'react-to-print';

function Barcode({articuls,types}) {
  const { inputRef } = useBarcode({
    value: articuls,
    options:{
      format: types,
    }
  });
  
  return <img ref={inputRef} alt=''/>;
};

function Barcodes() {

  let articul = React.createRef();
  let type = React.createRef();
  const [articuls, setArticuls] = useState();
  const [types, setTypes] = useState();
  var symbolsKol = {
    'code128':128,
    'codabar':128,
    'code39': 128,
    'ean2': 2,
    'ean5': 5,
    'ean8': 7,
    'ean13': 12,
    'upc': 11,
    'itf14': 13,
    'msi':128,
    'pharmacode':5,
    'datamatrix':128,
    'QRCode':128
  };

  function isNumber(e){
    return /^\d+$/.test(e);
  }

  const setInputToValue = () => {
    let artCurrent = articul.current.value;
    let typeCurrent = type.current.value;
    if (artCurrent.length !== symbolsKol[typeCurrent])
    {
      if (artCurrent.length > symbolsKol[typeCurrent]){
        return alert('Неправильное количество символов');
      }
      else if (symbolsKol[typeCurrent] < 128) {
        return alert('Неправильное количество символов');
      }
    }

    if ((isNumber(artCurrent) === false) && ((typeCurrent === 'ean5') || (typeCurrent === 'ean2') || (typeCurrent === 'ean8') 
    || (typeCurrent === 'codabar') || (typeCurrent === 'ean13') || (typeCurrent === 'upc') || (typeCurrent === 'itf14') 
    || (typeCurrent === 'itf') ||(typeCurrent === 'msi'))) {
      return alert ('Должны использоваться только цифры');
    }

    setArticuls(artCurrent);
    setTypes(typeCurrent);
  };

  const componentRef= useRef();
  const generatePDF = useReactToPrint({
    content: ()=>componentRef.current,
    documentTitle: "Печать штрихкода",
  });


  // function print() {
  //   var printCSS = '<style> div{ display:flex; justify-content:center;}</style>';
  //   var printBarcode = document.getElementById('print-barcode').innerHTML;
  //   var windowPrint = window.open("", "mywindow1", "status=1,width=100,height=100");
  //   windowPrint.document.write(printBarcode);
  //   windowPrint.document.write(printCSS);
  //   windowPrint.document.close();
  //   windowPrint.focus();
  //   windowPrint.print();
  //   // windowPrint.close();
  // }


  return (
    <div className="container">
      <div className="form_articul">
        <label className='articul_label'>Номер штрихкода</label>
        <input className='articul_input' placeholder="Введите номер" ref={articul} defaultValue=""/>
      </div>

      <div className="form_type">
        <label className="banner text-center">Тип штрихкода</label>
        <select id="barcodeType" className="form_control" ref={type}>
          <option value="code128">CODE 128</option>
          <option value="codabar">Codabar</option>
          <option value="code39">CODE 39</option>
          <option value="ean2">EAN 2</option>                  
          <option value="ean5">EAN 5</option>
          <option value="ean8">EAN 8</option>
          <option value="ean13">EAN 13</option>
          <option value="upc">UPC</option>
          <option value="itf14">ITF-14</option>
          <option value="msi">MSI</option>
          <option value="pharmacode">Pharmacode</option>
          <option value="datamatrix">Data Matrix</option>
          <option value="QRCode">QR-Code</option>
        </select>
      </div>

      <button className="btn generate" onClick={setInputToValue}>Сгенерировать</button>
      <button className="btn print" onClick={generatePDF}>Печать</button>
      <div id='print-barcode' ref={componentRef} style={{width:'100%', display:'flex', justifyContent:'center'}}>
        <div>
        {
          types === 'QRCode'
          ? <QRCode value={articuls} size={135} includeMargin={20}/>
          : (types ==='datamatrix' ? <DataMatrix msg={articuls} pal='' dim={135}/> : <Barcode articuls={articuls} types={types}/>)
        }
        </div>
      </div>
    </div>
  );
}

export default Barcodes;

