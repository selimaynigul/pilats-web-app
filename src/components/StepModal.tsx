import React, { useEffect, useRef, useState } from "react";
import { Modal, Steps, Button, Form, Row, Col } from "antd";
import styled from "styled-components";
import { useLanguage } from "hooks";
import { useTheme } from "contexts/ThemeProvider";

const SliderWrapper = styled.div<{ height?: number }>`
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  transition: height 0.3s ease;
  height: ${(props) => (props.height ? `${props.height}px` : "auto")};
`;

const SliderContent = styled.div<{ offset: number }>`
  display: flex;
  transition: transform 0.3s ease;
  transform: translateX(${(props) => -props.offset * 100}%);
  width: 100%;

  > div {
    width: 100%;
    flex-shrink: 0;
  }
`;

const ModalBody = styled.div`
  padding: 48px 72px;
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 768px) {
    padding: 24px 0px;
  }

  .ant-btn {
    height: 40px;
    border-radius: 50px;
    font-size: 12px;
    padding-right: 24px;
    padding-left: 24px;
  }
  .ant-btn-primary {
    background: ${({ theme }) => theme.primary};
  }
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.text};
`;

const MiniTitle = styled.h4`
  color: ${({ theme }) => theme.text};
`;

const MiniDescription = styled.small`
  color: ${({ theme }) => theme.text}90;
`;

const StepBarWrapper = styled.div`
  margin: 8px auto 0;
  max-width: 70%;

  .ant-steps .ant-steps-item-process .ant-steps-item-icon {
    background: ${({ theme }) => theme.primary};
    border-color: ${({ theme }) => theme.primary};
  }

  .ant-steps .ant-steps-item-finish .ant-steps-item-icon > .ant-steps-icon {
    color: ${({ theme }) => theme.primary};
  }

  .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
    background: ${({ theme }) => theme.contentBg};
  }

  .ant-steps
    .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title::after {
    background: ${({ theme }) => theme.primary};
  }

  .ant-steps
    .ant-steps-item-process
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: ${({ theme }) => theme.text};
  }

  .ant-steps
    .ant-steps-item-wait
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: ${({ theme }) => theme.text}70;
  }

  .ant-steps .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon {
    color: ${({ theme }) => theme.text}70;
  }

  .ant-steps .ant-steps-item-wait .ant-steps-item-icon {
    background: ${({ theme }) => theme.stepBg};
  }

  .ant-steps
    .ant-steps-item-finish
    > .ant-steps-item-container
    > .ant-steps-item-content
    > .ant-steps-item-title {
    color: ${({ theme }) => theme.text}70;
  }

  .ant-steps .ant-steps-item-finish .ant-steps-item-icon {
    border-color: transparent;
  }

  @media (max-width: 768px) {
    max-width: 1000px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  > * {
    flex: 1 1 100%;

    * {
      margin-bottom: 0px;
    }
  }
`;

export const FormRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  > * {
    flex: 1 1 calc(50% - 8px);
  }

  @media (max-width: 768px) {
    > * {
      flex: 1 1 100% !important;
    }
  }
`;

const FooterButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;

  .ant-btn-default:hover {
    background: ${({ theme }) => theme.contentBg} !important;
  }
`;

export interface StepBlock {
  title: string;
  description?: string;
  fields: React.ReactNode[];
}

export interface CustomStep {
  label: string;
  buttonText: string;
  blocks: StepBlock[];
}

interface StepModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  steps: CustomStep[];
  loading?: boolean;
  form: any;
}

const StepModal: React.FC<StepModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title,
  steps,
  loading,
  form,
}) => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const isFirst = currentStep === 0;

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    const activeSlide = slideRefs.current[currentStep];
    if (!activeSlide) return;

    const observer = new ResizeObserver(() => {
      setContainerHeight(activeSlide.offsetHeight);
    });

    observer.observe(activeSlide);

    return () => observer.disconnect();
  }, [currentStep]);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      closable
      width={1000}
      styles={{ body: { padding: 0 } }}
      centered
    >
      <ModalBody>
        {/* Header: Title + Steps */}
        <Row gutter={[48, 32]} style={{ marginBottom: 32 }}>
          <Col xs={24} md={8}>
            <Title>{title}</Title>
          </Col>
          <Col xs={24} md={16}>
            {steps.length > 1 && (
              <StepBarWrapper>
                <Steps size="small" current={currentStep}>
                  {steps.map((s, i) => (
                    <Steps.Step key={i} title={s.label} />
                  ))}
                </Steps>
              </StepBarWrapper>
            )}
          </Col>
        </Row>

        <SliderWrapper height={containerHeight}>
          <SliderContent offset={currentStep}>
            {steps.map((step, stepIndex) => (
              <div
                key={stepIndex}
                ref={(el) => (slideRefs.current[stepIndex] = el)}
                style={{ margin: "auto" }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  variant="filled"
                  requiredMark={false}
                >
                  {step.blocks.map((block, index) => (
                    <Row
                      gutter={[48, 32]}
                      key={index}
                      style={{ marginBottom: 48 }}
                      align="top"
                    >
                      <Col xs={24} md={8}>
                        <MiniTitle>{block.title}</MiniTitle>
                        <MiniDescription>{block.description}</MiniDescription>
                      </Col>
                      <Col xs={24} md={16}>
                        <FormContainer>
                          {block.fields.map((field, i) => (
                            <div key={i}>{field}</div>
                          ))}
                        </FormContainer>
                      </Col>
                    </Row>
                  ))}
                </Form>
              </div>
            ))}
          </SliderContent>
        </SliderWrapper>

        <Row gutter={[48, 0]}>
          <Col xs={0} md={8} /> {/* boş alan */}
          <Col xs={24} md={16}>
            <FooterButtons>
              <small style={{ marginRight: "auto", color: "grey" }}>
                * {t.thisFieldIsMandatory}
              </small>
              {!isFirst && (
                <Button
                  style={{
                    background: theme.bodyBg,
                    color: theme.text,
                    borderColor: `${theme.text}50`,
                  }}
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={loading}
                >
                  {t.previous}
                </Button>
              )}
              {!isLast ? (
                <Button
                  type="primary"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  loading={loading}
                >
                  {current.buttonText || "Next"}
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => {
                    onSubmit();
                  }}
                  loading={loading}
                >
                  {current.buttonText || "Submit"}
                </Button>
              )}
            </FooterButtons>
          </Col>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default StepModal;
