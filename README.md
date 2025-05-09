# eip191

- EIP-191이란?
  - EIP-191(Ethereum Improvement Proposal 191)은 이더리움에서 서명 데이터의 포맷을 표준화한 제안입니다. 즉, 이더리움 스마트 컨트랙트와 외부 시스템이 메시지 서명 및 검증을 일관되게 처리할 수 있도록, 서명할 데이터와 그 구조를 명확히 규정합니다
- 주요 목적
  - 오프체인(Off-chain)에서 생성된 메시지 서명을 온체인(On-chain)에서 검증할 때, 데이터 해석의 혼동을 막고, 리플레이 공격(replay attack) 등 보안 문제를 예방하기 위함입니다.
  - 특히 멀티시그(Multisig) 지갑, 개인 메시지 서명 등 다양한 응용에서 일관된 방식으로 서명 데이터를 처리할 수 있게 합니다.
- 데이터 포맷 및 구조

  ```
  0x19 <1 byte version> <version specific data> <data to sign>
  ```

  - `0x19`: 항상 앞에 붙는 `prefix로`, 이 데이터가 RLP 인코딩이 아님을 명확히 하기 위한 값입니다.

  - `<1 byte version>`: 서명 데이터의 버전을 지정합니다. 대표적으로 0x00, 0x45 등이 사용됩니다.

  - `<version specific data>`: 버전에 따라 추가되는 데이터(예: 검증자 주소 등).

  - `<data to sign>`: 실제로 서명할 메시지 데이터

- 주요 버전
  | 버전 값 | 용도 및 설명 |
  |---------|--------------------------------------|
  | 0x00 | 검증자 주소와 임의 데이터 서명 |
  | 0x45 | 일반 메시지(personal_sign 등) 서명 |

- 예시

  - `0x19 0x00 <validator address> <data to sign>`
  - `0x19 0x45 "Ethereum Signed Message:\n" + len(message) + <data to sign>`

- 특징
  - 단순 문자열/바이트 데이터 서명에 적합
  - Prefix와 버전 필드로 리플레이 공격 방지
  - 대표적인 사용: personal_sign, eth_sign, 멀티시그 지갑 등

# Project Setting

- Node Version
  - v20.18.0
- Solidity Compiler Version
  - 0.8.22 (london)
