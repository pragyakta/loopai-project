import React, { useEffect, useState, useMemo } from "react";
import Papa from "papaparse";
import DataTable, { TableColumn } from "react-data-table-component";
import Pagination from "./Pagination";

interface CsvData {
  number: number;
  mod3: number;
  mod4: number;
  mod5: number;
  mod6: number;
}

const CsvDataComponent: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

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

  const paginatedData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return csvData.slice(firstPageIndex, lastPageIndex);
  }, [csvData, currentPage]);

  return (
    <div>
      <h2>CSV DATA</h2>
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
