import React, { useState } from "react";
import { Table, notification } from "antd";

interface Props<T> {
  columns: any[];
  dataSource: T[];
  rowKey: string;
  loading?: boolean;
  pagination?: any;
  loadChildren?: (record: T) => Promise<any[]>;
  renderChildren?: (childrenData: any[], record: T) => React.ReactNode;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
}

export const ExpandableTable = <T extends { id: number | string }>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  pagination,
  loadChildren,
  renderChildren,
  onChange
}: Props<T>) => {
  const [childrenData, setChildrenData] = useState<Record<string, any[]>>({});
  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Array<number | string>
  >([]);

  const handleExpand = async (expanded: boolean, record: T) => {
    if (expanded) {
      setExpandedRowKeys((prev) => [...prev, record.id]);

      if (loadChildren && !childrenData[record.id]) {
        try {
          const children = await loadChildren(record);
          setChildrenData((prev) => ({ ...prev, [record.id]: children }));
        } catch {
          notification.error({
            title: "Error",
            description: "Failed to load children.",
            placement: "topRight"
          });
        }
      }
    } else {
      setExpandedRowKeys((prev) => prev.filter((id) => id !== record.id));
    }
  };

  const handleTableChange = (
    paginationParam: any,
    filters: any,
    sorterParam: any
  ) => {
    setExpandedRowKeys([]);
    setChildrenData({});
    onChange?.(paginationParam, filters, sorterParam);
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      pagination={pagination}
      onChange={handleTableChange}
      expandable={
        renderChildren
          ? {
              expandedRowKeys,
              expandedRowRender: (record: T) =>
                renderChildren(childrenData[record.id] || [], record),
              onExpand: handleExpand
            }
          : undefined
      }
    />
  );
};
