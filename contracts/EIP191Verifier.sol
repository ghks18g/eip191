// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract EIP191Verifier {
    
    function verifyMessage(
        bytes32 hash,
        bytes memory signature
    ) public pure returns (address) {
        // EIP-191 포맷 재구성
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                hash
            )
        );
        
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        address signer = ecrecover(messageHash, v, r, s);
        return signer;
    }


    // 서명 분할
    function splitSignature(bytes memory sig)
        internal pure returns (uint8 v, bytes32 r, bytes32 s)
    {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}