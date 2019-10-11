import React from 'react';

import { Form, Input, Button, Table } from 'antd';
import { FormComponentProps } from "antd/es/form";


interface CustomFormComponentProps extends FormComponentProps {
    onChange(field?: any): void;
    onFieldsChange(field?: any): void;
    className: string;
    [key: string]: any;
}


interface TableProps {
    columns : Array<any>;
    data : Array<any>;
    total: number;
    current : number;
    pageSize ?: number;
    onPageChange ?(page: number, pageSize?: number | undefined) : void;
    [key: string]: any;
}

/**
 * 表单
 */
export const BaseInfoForm = Form.create<CustomFormComponentProps>({
    // name: 'global_state',
    onFieldsChange(props, changedFields) {
        props.onFieldsChange && props.onFieldsChange(changedFields);
    },
    mapPropsToFields(props: CustomFormComponentProps) {
        const fields: any = {};
        Object.keys(props.items).forEach(key => {
            fields[key] = Form.createFormField({
                ...props.items[key],
            });
        });
        return fields;
    },
    onValuesChange(props, values) {
        // console.log(values);
        props.onChange && props.onChange(values);
    },
})((props: CustomFormComponentProps) => {
    const { form, items, layout, className, reset } = props;
    const { getFieldDecorator, resetFields } = form;

    return (
        <Form layout={layout} labelCol={{ span: 3 }} wrapperCol={{ span: 14 }} className={className}>
            {
                Object.keys(items).map(key => {
                    const item = items[key];
                    return <Form.Item label={item.title} key={key}>
                        {getFieldDecorator(key, item.decorator)(item.inputElement || <Input />)}
                    </Form.Item>
                })
            }
            {
                reset ? <Form.Item>
                        <Button type="link" onClick={() => { resetFields() }}>重置</Button>
                    </Form.Item> : null
            }
        </Form>
    );
});


/**
 * 表格
 */
export class EditableTable extends React.Component<TableProps> {

    render() {
        const { columns, data, total, current, pageSize, onPageChange, style }: any = this.props;

        return (
            <div style={style || { background: '#fff', marginTop: 20 }}>
                <Table
                    bordered
                    pagination={{
                        total,
                        current,
                        pageSize: pageSize || 20,
                        onChange: onPageChange
                    }}
                    dataSource={data}
                    columns={columns}
                />
            </div>
        );
    }
}