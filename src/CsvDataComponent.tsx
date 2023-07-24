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
  const [filterValues, setFilterValues] = useState<Record<string, number | null>>({
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

 

  const handleModChange = (column: string, value: number | null) => {
    console.log(`Filter Changed: ${column} - ${value}`);
    setFilterValues((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const getDistinctValues = (column: string): string[] => {
    const columnData = csvData.map((row) => row[column].toString());
    return Array.from(new Set(columnData));
  };
  

  const filteredData = useMemo(() => {
    // Check if any filter value is not null
    const anyFilterApplied = Object.values(filterValues).some((value) => value !== null);
  
    if (anyFilterApplied) {
      const filtered = csvData.filter((row) => {
        return Object.keys(filterValues).every((column) => {
          const selectedValue = filterValues[column];
          return selectedValue === null || row[column] === selectedValue;
        });
      });
  
      console.log("Filtered Data:", filtered); // Add this log
  
      return filtered;
    } else {
      // If no filter applied, return the paginated data
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
        onSelect={(selectedOptions: any) =>{

            console.log("Selected Options for mod3:", selectedOptions);

          handleModChange("mod3", selectedOptions.length > 0 ? parseInt(selectedOptions[0].key) : null)
        }}
      />
      <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod4")}
        showCheckbox
        onSelect={(selectedOptions: any) =>
          handleModChange("mod4", selectedOptions.length > 0 ? parseInt(selectedOptions[0].key) : null)
        }
      />
     <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod5")}
        showCheckbox
        onSelect={(selectedOptions: any) =>
          handleModChange("mod5", selectedOptions.length > 0 ? parseInt(selectedOptions[0].key) : null)
        }
      />
      <Multiselect
        displayValue="key"
        options={getOptionsForColumn("mod6")}
        showCheckbox
        onSelect={(selectedOptions: any) =>
          handleModChange("mod6", selectedOptions.length > 0 ? parseInt(selectedOptions[0].key) : null)
        }
      />
      <DataTable
        columns={columns}
        data={paginatedData}
        pagination
        paginationServer
        paginationTotalRows={csvData.length}
        paginationPerPage={PageSize}
        noHeader
        paginationComponent={() => (
          <Pagination
            totalCount={csvData.length}
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
