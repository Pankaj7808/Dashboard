import React from "react";
import { Modal, Button, TextField, IconButton } from "@mui/material";
import { Formik, Form, FieldArray, Field } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  widgetName: Yup.string().required("Widget Name is required"),
  fields: Yup.array().of(
    Yup.object().shape({
      factor: Yup.string().required("Factor is required"),
      value: Yup.number("Must be number").required("Value is required"),
    })
  ),
});

const WidgetForm = ({ open, onClose, widget, handleAddChartData }) => {
  const initialValues = {
    widgetName: "",
    fields: [{ factor: "", value: "" }],
  };

  const handleSubmit = (values) => {
    const newWidgetName = values.widgetName;
    const newFields = values.fields;
    handleAddChartData(widget, newWidgetName, newFields);
    onClose();
  };
  console.log(widget);
  return (
    <Modal open={open} onClose={onClose}>
      <div style={styles.modalContent}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleReset }) => (
            <Form>
              <Field
                as={TextField}
                name="widgetName"
                label="Widget Name"
                variant="outlined"
                size="small"
                fullWidth
                error={touched.widgetName && !!errors.widgetName}
                helperText={touched.widgetName && errors.widgetName}
                style={{ marginBottom: "20px" }}
              />
              <FieldArray name="fields">
                {({ push, remove }) => (
                  <div>
                    {values.fields.map((field, index) => (
                      <div key={index} style={styles.fieldRow}>
                        <Field
                          as={TextField}
                          name={`fields[${index}].factor`}
                          label="Factor"
                          variant="outlined"
                          error={
                            touched.fields?.[index]?.factor &&
                            !!errors.fields?.[index]?.factor
                          }
                          helperText={
                            touched.fields?.[index]?.factor &&
                            errors.fields?.[index]?.factor
                          }
                          size="small"
                          style={{ marginRight: "10px" }}
                        />
                        <Field
                          as={TextField}
                          name={`fields[${index}].value`}
                          label="Value"
                          variant="outlined"
                          error={
                            touched.fields?.[index]?.value &&
                            !!errors.fields?.[index]?.value
                          }
                          helperText={
                            touched.fields?.[index]?.value &&
                            errors.fields?.[index]?.value
                          }
                          size="small"
                          style={{ marginRight: "10px" }}
                        />
                        <IconButton
                          onClick={() => remove(index)}
                          color="secondary"
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                    ))}
                    <Button
                      onClick={() => push({ factor: "", value: "" })}
                      variant="outlined"
                      color="primary"
                    >
                      Add Field
                    </Button>
                  </div>
                )}
              </FieldArray>
              <div style={styles.buttonRow}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ marginRight: "10px" }}
                >
                  Submit
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outlined"
                  color="secondary"
                >
                  Reset
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

const styles = {
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    width: "600px",
    maxHeight: "80vh", // Modal height capped at 80% of viewport height
    overflowY: "auto", // Scrollable if content overflows
    outline: "none",
  },
  fieldRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  buttonRow: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "flex-end",
  },
};

export default WidgetForm;
