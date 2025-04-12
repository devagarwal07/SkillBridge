// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title ProposalContract
 * @dev Contract for creating and voting on proposals in SkillBridge
 */
contract ProposalContract {
    // Struct for proposal details
    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 amount;
        address payable recipient;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        bool executed;
        bool rejected;
        mapping(address => bool) hasVoted;
    }

    // State variables
    address public owner;
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    
    // Events
    event ProposalCreated(uint256 indexed id, string title, uint256 amount, uint256 deadline);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId, uint256 amount);
    event ProposalRejected(uint256 indexed proposalId);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        proposalCount = 0;
    }
    
    /**
     * @dev Create a new proposal
     * @param _title Title of the proposal
     * @param _description Description of the proposal
     * @param _amount Amount of ETH requested
     * @param _recipient Address to receive the funds if proposal passes
     * @param _deadline Timestamp for the voting deadline
     */
    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _amount,
        address payable _recipient,
        uint256 _deadline
    ) public onlyOwner {
        require(_deadline > block.timestamp, "Deadline must be in the future");
        require(_amount > 0, "Amount must be greater than 0");
        
        proposalCount++;
        Proposal storage newProposal = proposals[proposalCount];
        
        newProposal.id = proposalCount;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.amount = _amount;
        newProposal.recipient = _recipient;
        newProposal.yesVotes = 0;
        newProposal.noVotes = 0;
        newProposal.deadline = _deadline;
        newProposal.executed = false;
        newProposal.rejected = false;
        
        emit ProposalCreated(proposalCount, _title, _amount, _deadline);
    }
    
    /**
     * @dev Vote on a proposal
     * @param _proposalId ID of the proposal
     * @param _support True for yes vote, false for no vote
     */
    function vote(uint256 _proposalId, bool _support) public {
        Proposal storage proposal = proposals[_proposalId];
        
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        require(block.timestamp < proposal.deadline, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "You have already voted");
        require(!proposal.executed, "Proposal has already been executed");
        require(!proposal.rejected, "Proposal has already been rejected");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.yesVotes += 1;
        } else {
            proposal.noVotes += 1;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support);
    }
    
    /**
     * @dev Execute a successful proposal
     * @param _proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 _proposalId) public onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        require(block.timestamp >= proposal.deadline, "Voting period has not ended");
        require(!proposal.executed, "Proposal has already been executed");
        require(!proposal.rejected, "Proposal has already been rejected");
        require(proposal.yesVotes > proposal.noVotes, "Proposal did not pass");
        require(address(this).balance >= proposal.amount, "Contract does not have enough funds");
        
        proposal.executed = true;
        
        (bool success, ) = proposal.recipient.call{value: proposal.amount}("");
        require(success, "Transfer failed");
        
        emit ProposalExecuted(_proposalId, proposal.amount);
    }
    
    /**
     * @dev Reject a failed proposal
     * @param _proposalId ID of the proposal to reject
     */
    function rejectProposal(uint256 _proposalId) public onlyOwner {
        Proposal storage proposal = proposals[_proposalId];
        
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        require(block.timestamp >= proposal.deadline, "Voting period has not ended");
        require(!proposal.executed, "Proposal has already been executed");
        require(!proposal.rejected, "Proposal has already been rejected");
        require(proposal.noVotes >= proposal.yesVotes, "Proposal did not fail");
        
        proposal.rejected = true;
        
        emit ProposalRejected(_proposalId);
    }
    
    /**
     * @dev Get proposal details
     * @param _proposalId ID of the proposal
     * @return Title, description, amount, yes votes, no votes, deadline, executed status, and rejected status
     */
    function getProposal(uint256 _proposalId) public view returns (
        string memory, 
        string memory, 
        uint256, 
        uint256, 
        uint256, 
        uint256, 
        bool, 
        bool
    ) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.title,
            proposal.description,
            proposal.amount,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.deadline,
            proposal.executed,
            proposal.rejected
        );
    }
    
    /**
     * @dev Check if an address has voted on a proposal
     * @param _proposalId ID of the proposal
     * @param _voter Address of the voter
     * @return Whether the address has voted
     */
    function hasVoted(uint256 _proposalId, address _voter) public view returns (bool) {
        require(_proposalId > 0 && _proposalId <= proposalCount, "Invalid proposal ID");
        return proposals[_proposalId].hasVoted[_voter];
    }
    
    /**
     * @dev Allow the contract to receive ETH
     */
    receive() external payable {}
}
