import {
  FieldLabel,
  FormInput,
  FormRadioOption,
} from "@/app/_components/register";
import Image from "next/image";
import type { Dispatch, SetStateAction } from "react";
import type { FormState } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  setForm: Dispatch<SetStateAction<FormState>>;
  update: (
    field: keyof Omit<FormState, "members" | "hasDeposited">,
    value: string,
  ) => void;
};

export const PaymentSection = ({ form, errors, setForm, update }: Props) => {
  if (!form.participationType) return null;

  const isTeam = form.participationType === "TEAM";

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-gray-50 p-5 space-y-3">
        <FieldLabel as="p" className="flex items-center gap-1.5">
          <Image
            src="/images/alert.png"
            alt=""
            width={25}
            height={25}
            sizes="25px"
          />
          참가비 안내
        </FieldLabel>
        <div className="rounded-xl bg-gray-0 p-5 space-y-3">
          <div>
            <p className="typo-body3 text-gray-600">
              참가비:{" "}
              <span className="typo-subtitle6 sm:typo-subtitle5 text-foreground">
                1인당 ₩20,000
              </span>{" "}
              <br className="sm:hidden" />
              (점심 식사, 공간 이용, 다과 및 운영 비용 포함)
            </p>
            <p className="typo-body3 text-gray-600">
              입금 계좌:{" "}
              <span className="typo-subtitle6 sm:typo-subtitle5 text-foreground">
                3333-12-1608630 카카오뱅크
              </span>{" "}
              <br className="sm:hidden" />
              <span className="typo-subtitle6 sm:typo-subtitle5 text-foreground">
                (예금주: 송채영)
              </span>
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="typo-body3 sm:typo-body1 text-gray-500">
              참가비는 노쇼 방지 및 원활한 행사 운영을 위한 최소 비용으로
              사용됩니다.
            </p>
            <p className="typo-body3 sm:typo-body1 text-gray-500">
              행사 준비가 시작된 이후에는 환불이 어려울 수 있으니 신청 시 참고해
              주세요.
            </p>
            <p className="typo-body3 sm:typo-body1 text-gray-500">
              선착순 접수로 마감이 된 경우, 환불 처리해드려요.
            </p>
          </div>
          <p className="typo-subtitle6 sm:typo-subtitle5 text-error">
            *원활한 참가를 위해 입금시 참가자 명으로 입금 부탁드려요!
          </p>
        </div>
      </div>

      <div>
        <FieldLabel as="p" required className="mb-3">
          환불받을 계좌
        </FieldLabel>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="reg-refundBank" size="sm">
              은행명
            </FieldLabel>
            <FormInput
              id="reg-refundBank"
              type="text"
              value={form.refundBank}
              onChange={(e) => update("refundBank", e.target.value)}
              placeholder="카카오뱅크"
              error={errors.refundBank}
            />
          </div>
          <div>
            <FieldLabel htmlFor="reg-refundAccount" size="sm">
              계좌번호
            </FieldLabel>
            <FormInput
              id="reg-refundAccount"
              type="text"
              value={form.refundAccount}
              onChange={(e) => update("refundAccount", e.target.value)}
              placeholder="1234-56-7890123"
              error={errors.refundAccount}
            />
          </div>
          <div>
            <FieldLabel htmlFor="reg-refundAccountHolder" size="sm">
              예금주
            </FieldLabel>
            <FormInput
              id="reg-refundAccountHolder"
              type="text"
              value={form.refundAccountHolder}
              onChange={(e) => update("refundAccountHolder", e.target.value)}
              placeholder="홍길동"
              error={errors.refundAccountHolder}
            />
          </div>
        </div>
      </div>

      {/* 입금 확인 */}
      <div>
        <FieldLabel as="p" required>
          참가비 입금 여부
        </FieldLabel>
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2">
          <FormRadioOption
            name="hasDeposited"
            checked={form.hasDeposited === true}
            onChange={() =>
              setForm((prev) => ({ ...prev, hasDeposited: true }))
            }
            label={isTeam ? "모든 팀원 완료" : "완료"}
            description="안내된 계좌로 입금을 마쳤어요"
            className="py-3"
          />
          <FormRadioOption
            name="hasDeposited"
            checked={!form.hasDeposited}
            onChange={() =>
              setForm((prev) => ({ ...prev, hasDeposited: false }))
            }
            label="미완료"
            description={
              isTeam
                ? "모든 팀원이 참가비를 입금해 주세요"
                : "참가비를 입금해 주세요"
            }
            variant="gray"
            className="py-3"
          />
        </div>
      </div>
    </div>
  );
};
