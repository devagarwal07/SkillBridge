// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ZKPVerification
 * @dev Contract for verifying zero-knowledge proofs for identity verification
 */
contract ZKPVerification {
    // State variables
    address public owner;
    mapping(address => bool) public verifiedUsers;
    mapping(address => bytes32) public userProofHashes;
    
    // Events
    event ProofVerified(address indexed user, bytes32 proofHash);
    event ProofRevoked(address indexed user);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Submit a proof for verification
     * @param _proofHash The hash of the zero-knowledge proof
     */
    function submitProof(bytes32 _proofHash) public {
        // In a real implementation, we would verify the proof here
        // For demonstration purposes, we simply store the proof hash
        verifiedUsers[msg.sender] = true;
        userProofHashes[msg.sender] = _proofHash;
        
        emit ProofVerified(msg.sender, _proofHash);
    }
    
    /**
     * @dev Revoke a user's verification
     * @param _user The address of the user to revoke
     */
    function revokeVerification(address _user) public onlyOwner {
        require(verifiedUsers[_user], "User is not verified");
        
        verifiedUsers[_user] = false;
        delete userProofHashes[_user];
        
        emit ProofRevoked(_user);
    }
    
    /**
     * @dev Check if a user is verified
     * @param _user The address of the user to check
     * @return Whether the user is verified
     */
    function isVerified(address _user) public view returns (bool) {
        return verifiedUsers[_user];
    }
    
    /**
     * @dev Get the proof hash for a user
     * @param _user The address of the user
     * @return The proof hash
     */
    function getProofHash(address _user) public view returns (bytes32) {
        require(verifiedUsers[_user], "User is not verified");
        return userProofHashes[_user];
    }
}
