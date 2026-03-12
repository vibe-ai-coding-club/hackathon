import { FormError } from "@/app/_components/register";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { FormState } from "./types";

type Props = {
  form: FormState;
  errors: Record<string, string>;
  setForm: Dispatch<SetStateAction<FormState>>;
  setErrors: Dispatch<SetStateAction<Record<string, string>>>;
};

export const PrivacySection = ({ form, errors, setForm, setErrors }: Props) => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  if (!form.participationType) return null;

  return (
    <>
      <div className="space-y-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={form.privacyConsent}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                privacyConsent: e.target.checked,
              }));
              if (e.target.checked) {
                setErrors((prev) => {
                  const next = { ...prev };
                  delete next.privacyConsent;
                  return next;
                });
              }
            }}
            className="mt-0.5 size-5 shrink-0 accent-primary-400 cursor-pointer"
          />
          <span className="typo-body2">
            <span className="text-error">[필수]</span> 개인정보 수집·이용 및
            초상권 활용에 동의합니다.{" "}
            <button
              type="button"
              onClick={() => setPrivacyModalOpen(true)}
              className="cursor-pointer text-primary-400 underline underline-offset-2 hover:text-primary-500"
            >
              내용 보기
            </button>
          </span>
        </label>
        {errors.privacyConsent && (
          <FormError>{errors.privacyConsent}</FormError>
        )}
      </div>

      {privacyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setPrivacyModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="typo-subtitle1 text-lg">
                개인정보 수집·이용 및 초상권 활용 동의
              </h2>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
              >
                <svg className="size-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto typo-body3 text-gray-700">
              <div>
                <p className="typo-subtitle2 mb-1">1. 수집 목적</p>
                <p>
                  딸깍톤 해커톤 참가 신청 접수, 본인 확인, 행사 안내 및 운영,
                  참가비 환불 처리
                </p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">2. 수집 항목</p>
                <ul className="list-inside list-disc space-y-0.5">
                  <li>
                    <span className="font-medium">필수:</span> 이름, 이메일,
                    연락처(전화번호)
                  </li>
                  <li>
                    <span className="font-medium">필수:</span> 환불 계좌
                    정보(은행명, 계좌번호, 예금주)
                  </li>
                  <li>
                    <span className="font-medium">팀 참가 시:</span> 팀원 이름,
                    이메일, 연락처
                  </li>
                  <li>
                    <span className="font-medium">선택:</span> 참여 동기 및 문의
                    사항
                  </li>
                </ul>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">3. 보유 및 이용 기간</p>
                <p>
                  수집된 개인정보는{" "}
                  <span className="font-semibold">대회 종료 후 즉시 파기</span>
                  합니다. 단, 환불 처리가 완료되지 않은 경우 환불 완료 시까지
                  보유합니다.
                </p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">4. 동의 거부권 및 불이익</p>
                <p>
                  개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만,
                  필수 항목에 대한 동의를 거부할 경우 참가 신청이 불가합니다.
                </p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">
                  5. 현장 촬영 및 초상권 활용 동의
                </p>
                <p>
                  행사 당일 현장 사진 및 영상이 촬영될 수 있으며, 촬영된 자료는{" "}
                  <span className="font-semibold">
                    딸깍톤 행사 홍보 및 아카이빙 목적
                  </span>
                  으로 공식 웹사이트, SNS 등에 활용될 수 있습니다. 참가 신청 시
                  이에 동의한 것으로 간주하며, 촬영을 원하지 않을 경우 행사 당일
                  운영진에게 별도 요청하실 수 있습니다.
                </p>
              </div>

              <div>
                <p className="typo-subtitle2 mb-1">6. 파기 방법</p>
                <p>
                  전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구
                  삭제합니다.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, privacyConsent: true }));
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.privacyConsent;
                    return next;
                  });
                  setPrivacyModalOpen(false);
                }}
                className="cursor-pointer rounded-lg bg-primary-400 px-5 py-2.5 typo-subtitle4 text-white transition-colors hover:bg-primary-500"
              >
                동의하기
              </button>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="cursor-pointer rounded-lg bg-gray-100 px-5 py-2.5 typo-subtitle4 text-gray-600 transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
