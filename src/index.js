import React, { useState } from 'react';
import { render } from 'react-dom';
import { AgGridReact, AgGridColumn } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import FakeServer from './fakeserver';
import CustomLoadingCellRenderer from './CustomLoadingCellRenderer';

const GridExample = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [country, setCountry] = useState(null)
  const [year, setYear] = useState(null)
  const [sport, setSport] = useState(null)
  
  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => {
      var fakeServer = new FakeServer(data);
      var datasource = new ServerSideDatasource(fakeServer, gridApi);
      params.api.setServerSideDatasource(datasource);
    };

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };
  const updateCountrySelection=(event)=>{
    setCountry(event.target.value);
  }

  const updateSportSelection=(event)=>{
    setSport(event.target.value);
    if(sport){
      const filterInstance = gridApi.getFilterInstance("sport");
      filterInstance.setModel({
        filter:sport,
        filterType:"text",
        type:"equals"
      });
    }
  }

  const updateYearSelection=(event)=>{
    setYear(event.target.value);
    
  }
  const applySearch=()=>{
    if(country){
      const filterInstance = gridApi.getFilterInstance("country");
      filterInstance.setModel({
        filter:country,
        filterType:"text",
        type:"equals"
      });
    }
    if(year){
      const filterInstance = gridApi.getFilterInstance("year");
      filterInstance.setModel({
        filter:year,
        filterType:"text",
        type:"equals"
      });
    }
    gridApi.onFilterChanged();
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <label>Search Criteria</label>
        <select id="country" onChange={updateCountrySelection}>
            <option id="1" value="India">India</option>
            <option id="2" value="United States">United States</option>
            <option id="3" value="United Kingdom">United Kingdom</option>
            <option id="4" value="New Zealand">New Zealand</option>
            <option id="5" value="Japan">Japan</option>
            <option id="6" value="China">China</option>
        </select>
        <select id="year" onChange={updateYearSelection}>
            <option id="2004" value="2004">2004</option>
            <option id="2008" value="2008">2008</option>
            <option id="2012" value="2012">2012</option>
            <option id="2016" value="2016">2016</option>
        </select>
        <button id="searchBtn" onClick={applySearch}>Search</button>
      <div
        id="myGrid"
        style={{
          height: '100%',
          width: '100%',
        }}
        className="ag-theme-alpine-dark"
      > 
        <AgGridReact
          overlayLoadingTemplate={
            '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
          }
          overlayNoRowsTemplate={
            '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">This is a custom \'no rows\' overlay</span>'
          }
          rowModelType={'serverSide'}
          serverSideStoreType={'partial'}
          suppressAggFuncInHeader={true}
          cacheBlockSize={999}
          animateRows={true}
          rowGroupPanelShow="always"
          onGridReady={onGridReady}
          // frameworkComponents={{
          //   customLoadingCellRenderer: CustomLoadingCellRenderer,
          // }}
          // loadingCellRenderer={'customLoadingCellRenderer'}
          // loadingCellRendererParams={{
          //   loadingMessage: 'One moment please...',
          // }}
          //suppressLoadingOverlay={true}
          >

          <AgGridColumn field="country" enableRowGroup={true} filter="text"/>
          <AgGridColumn field="sport" enableRowGroup={true} filter="text" />
          <AgGridColumn field="year" enableRowGroup={true} filter="text" minWidth={100} />
          <AgGridColumn field="athlete" />
          <AgGridColumn field="gold" />
          <AgGridColumn field="silver"  />
          <AgGridColumn field="bronze" />
        </AgGridReact>
      </div>
    </div>
  );
};

function ServerSideDatasource(server, gridApi) {
  return {
    getRows: function (params) {
      console.log('[Datasource] - rows requested by grid: ', params.request);
      var response = server.getData(params.request);
      setTimeout(function () {
        
        if (response.success && response.rows.length > 0) {
          params.successCallback(response.rows, response.lastRow);
        } else {
          //params.api.showNoRowsOverlay()
          params.failCallback("No Rows");
        }
      }, 1000);
    },
  };
}

render(<GridExample></GridExample>, document.querySelector('#root'));
