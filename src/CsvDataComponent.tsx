import React, { useEffect, useState, useMemo} from "react";
import Papa from "papaparse";
import DataTable, { TableColumn } from "react-data-table-component";
import Pagination from "./Pagination";
import Multiselect from "multiselect-react-dropdown";

interface CsvData {
  number: number;
  mod3: number;
  mod4: number;
  mod5: number;
  mod6: number;
  [key: string]: number;
}

const CsvDataComponent: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  //const [options, setOptions] = useState<string[]>([]);
  //const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState<Record<string, Array<String> | null>>({
    mod3: null,
    mod4: null,
    mod5: null,
    mod6: null,
  });
  

  const PageSize = 100; // Number of rows per page for pagination
  const ScrollSize = 20; // Number of rows to show in scrolling

  useEffect(() => {
    fetch("/dataset_small.csv")
      .then((response) => response.text())
      .then((data) => {
        const parseData: Papa.ParseResult<unknown> = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
        });

        if (parseData && parseData.data) {
          const validData: CsvData[] = parseData.data as CsvData[];
          setCsvData(validData);
        }
      });
  }, []);

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };
 


  const columns: TableColumn<CsvData>[] = [
    { name: "Number", selector: (row) => row.number.toString(), sortable: true },
    { name: "mod3", selector: (row) => row.mod3.toString(), sortable: true },
    { name: "mod4", selector: (row) => row.mod4.toString(), sortable: true },
    { name: "mod5", selector: (row) => row.mod5.toString(), sortable: true },
    { name: "mod6", selector: (row) => row.mod6.toString(), sortable: true },
  ];

 

  const handleModChange = (column: string, values: any | null) => {
    console.log(`Filter Changed: ${column} - ${values}`);
    console.log(column, values)
    let selectedValues: Array<string>  = values?.map((value: { key: any; }) => value.key)
    setFilterValues((prev) => ({
      ...prev,
      [column]: selectedValues,
    }));
  };

  const getDistinctValues = (column: string): string[] => {
    const columnData = csvData.map((row) => row[column].toString());
    return Array.from(new Set(columnData));
  };
  

  const filteredData = useMemo(() => {
    // Check if any filter value is not null
    const anyFilterApplied = Object.values(filterValues).some((value) => value !== null && value !== undefined);
   
    if (anyFilterApplied) {
      const filtered = csvData.filter((row) => {
        if(filterValues["mod3"]?.includes(row.mod3.toString()) || filterValues["mod4"]?.includes(row.mod4.toString()) || filterValues["mod5"]?.includes(row.mod5.toString())
        || filterValues["mod6"]?.includes(row.mod6.toString())){
          return (
            (!filterValues["mod3"] || filterValues["mod3"].includes(row.mod3.toString())) &&
            (!filterValues["mod4"] || filterValues["mod4"].includes(row.mod4.toString())) &&
            (!filterValues["mod5"] || filterValues["mod5"].includes(row.mod5.toString())) &&
            (!filterValues["mod6"] || filterValues["mod6"].includes(row.mod6.toString()))
          )
        }
        
      });

      return filtered;
    } else {
      return csvData;
    }
  }, [csvData, filterValues]);

  
  const paginatedData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [filteredData, currentPage, PageSize]);

  
  const getOptionsForColumn = (column: string): { key: string}[] => {
    const distinctValues = getDistinctValues(column);
    return distinctValues.map((value) => ({ key: value }));
  };
  
 
  return (
    <div>
      <h2>CSV DATA</h2>
      <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod3")}
        showCheckbox
        placeholder="mod 3"
        onSelect={(selectedOptions: any) =>{
          handleModChange("mod3", selectedOptions.length > 0 ? selectedOptions : null)
        }}
        onRemove={(removedOptions: any) =>{
        handleModChange("mod3", removedOptions.length > 0 ? removedOptions : null)
      }}
      />
      <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod4")}
        showCheckbox
        placeholder="mod 4"
        onSelect={(selectedOptions: any) =>{
          handleModChange("mod4", selectedOptions.length > 0 ? selectedOptions : null)
        }}
        onRemove={(removedOptions: any) =>{
        handleModChange("mod4", removedOptions.length > 0 ? removedOptions : null)
      }}/>
      <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod5")}
        showCheckbox
        placeholder="mod 5"
        onSelect={(selectedOptions: any) =>{
          handleModChange("mod5", selectedOptions.length > 0 ? selectedOptions : null)
        }}
        onRemove={(removedOptions: any) =>{
        handleModChange("mod5", removedOptions.length > 0 ? removedOptions : null)
      }}/>
      <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod6")}
        showCheckbox
        placeholder="mod 6"
        onSelect={(selectedOptions: any) =>{
          handleModChange("mod6", selectedOptions.length > 0 ? selectedOptions : null)
        }}
        onRemove={(removedOptions: any) =>{
        handleModChange("mod6", removedOptions.length > 0 ? removedOptions : null)
      }}/>
      

      <DataTable
        columns={columns}
        data={paginatedData}
        pagination
        paginationServer
        paginationTotalRows={filteredData.length}
        paginationPerPage={PageSize}
        noHeader
        paginationComponent={() => (
          <Pagination
            totalCount={filteredData.length}
            currentPage={currentPage}
            pageSize={PageSize}
            onPageChange={handlePageChange}
          />
        )}
        fixedHeader // To keep the table header fixed
        fixedHeaderScrollHeight={`${ScrollSize * 30}px`} // Set the height for scrolling
      />
    </div>
  );
};

export default CsvDataComponent;
