import type * as CSS from "csstype";
import { useEffect, useState } from "react";
import BasicTable, { BasicTableDataType, BasicTableProps } from "../BasicTable";
import { BasicTableColumnDef } from "../components/BasicTableUtil";

interface ControlledBasicTableProps<ColName extends string> {
  data: BasicTableDataType<ColName>[];
  orderedColNames: ColName[];
  columnDef: BasicTableColumnDef<ColName>;
  rowClass: string;
  uniqueId?: ColName;
  maxRows?: number;
  editing?: boolean;
  textfield: BasicTableProps<ColName>["editable"]["textfield"];
  style?: CSS.Properties;
  validateUpsertedRecord: (
    newRecord: Record<ColName, string>,
    existingData: BasicTableDataType<ColName>[],
    isInserting: boolean
  ) => boolean;
  disableInsert?: (data: BasicTableDataType<ColName>[]) => boolean;
  onChange: (update: BasicTableDataType<ColName>[]) => void;
}
function ControlledBasicTable<ColName extends string>(
  props: ControlledBasicTableProps<ColName>
) {
  const [data, setData] = useState(props.data);

  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(props.data)) {
      props.onChange(data);
    }
  }, [data]);

  const fmtDataUid = (record: BasicTableDataType<ColName>) =>
    props.uniqueId ? `${record[props.uniqueId]}`.toLowerCase() : undefined;
  return (
    <BasicTable
      data={data}
      orderedColNames={props.orderedColNames}
      columnDef={props.columnDef}
      style={props.style}
      editable={
        !props.editing
          ? undefined
          : {
              rowClass: props.rowClass,
              textfield: props.textfield,
              insertable: {
                maxRows: props.maxRows,
                disabled: props.disableInsert?.(data) || false,
                onInsert: (record) => {
                  if (
                    (props.uniqueId &&
                      data.some(
                        (oldRec) => fmtDataUid(oldRec) === fmtDataUid(record)
                      )) ||
                    !props.validateUpsertedRecord(record, data, true)
                  )
                    return;

                  setData((existingData) => [...existingData, record]);
                },
              },
              onDeleteRow: (rowIdx) =>
                setData((existingData) =>
                  existingData.filter((_, i) => i !== rowIdx)
                ),
              onUpdateRow: (rowIdx, record) => {
                if (
                  (props.uniqueId &&
                    data.some(
                      (oldRec, i) =>
                        fmtDataUid(oldRec) === fmtDataUid(record) &&
                        i !== rowIdx
                    )) ||
                  !props.validateUpsertedRecord(record, data, false)
                )
                  return;
                setData((existingData) =>
                  existingData.map((oldData, i) =>
                    i === rowIdx ? record : oldData
                  )
                );
              },
            }
      }
    />
  );
}

export default ControlledBasicTable;
