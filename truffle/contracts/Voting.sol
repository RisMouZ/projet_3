// SPDX-License-Identifier: MIT
pragma solidity >=0.8.14;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Voting is Ownable {
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint256 votedProposalId;
    }
    struct Proposal {
        string description;
        uint256 voteCount;
    }
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    uint256 private winningProposalId;

    mapping(address => Voter) voters;

    Proposal[] public proposals;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(
        uint256 proposalId,
        string desc,
        uint256 voteCount
    );
    event Voted(address voter, uint256 proposalId);

    modifier flowStatus(WorkflowStatus _status) {
        require(
            workflowStatus == _status,
            "You are not able to do this action right now"
        );
        _;
    }

    // ::::::::::::: GETTERS ::::::::::::: //

    function getVoter(address _addr) external view returns (Voter memory) {
        require(
            voters[msg.sender].isRegistered,
            "You are not allowed to get a voter"
        );
        return voters[_addr];
    }

    function getOneProposal(uint256 _id)
        external
        view
        returns (Proposal memory)
    {
        require(
            voters[msg.sender].isRegistered,
            "You are not allowed to get a proposal"
        );
        return proposals[_id];
    }

    // ::::::::::::: REGISTRATION ::::::::::::: //

    function registerVoters(address _voterAddress)
        public
        flowStatus(WorkflowStatus.RegisteringVoters)
        onlyOwner
    {
        require(
            !voters[_voterAddress].isRegistered,
            "This address is already in voters"
        );

        voters[_voterAddress].isRegistered = true;

        emit VoterRegistered(_voterAddress);
    }

    // ::::::::::::: PROPOSAL ::::::::::::: //

    function startProposalsRegistration()
        public
        flowStatus(WorkflowStatus.RegisteringVoters)
        onlyOwner
    {
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
        );
    }

    function registerProposals(string memory proposalDescription)
        public
        flowStatus(WorkflowStatus.ProposalsRegistrationStarted)
    {
        require(
            voters[msg.sender].isRegistered,
            "You are not allowed to make a proposal"
        );

        require(
            keccak256(abi.encode(proposalDescription)) !=
                keccak256(abi.encode("")),
            "You can't propose nothing"
        );

        proposals.push(Proposal(proposalDescription, 0));
        voters[msg.sender].votedProposalId = proposals.length + 1;
        emit ProposalRegistered(proposals.length - 1, proposalDescription, 0);
    }

    function endProposalsRegistration()
        public
        flowStatus(WorkflowStatus.ProposalsRegistrationStarted)
        onlyOwner
    {
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
        );
    }

    // ::::::::::::: VOTE ::::::::::::: //

    function startVotingSession()
        public
        flowStatus(WorkflowStatus.ProposalsRegistrationEnded)
        onlyOwner
    {
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
        );
    }

    function vote(uint256 proposalId)
        public
        flowStatus(WorkflowStatus.VotingSessionStarted)
    {
        require(voters[msg.sender].isRegistered, "You are not allowed to vote");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        proposals[proposalId].voteCount += 1;
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = proposalId;

        if (
            proposals[proposalId].voteCount >
            proposals[winningProposalId].voteCount
        ) {
            winningProposalId = proposalId;
        }

        emit Voted(msg.sender, proposalId);
    }

    function endVotingSession()
        public
        flowStatus(WorkflowStatus.VotingSessionStarted)
        onlyOwner
    {
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
        );
    }

    function votesTallied()
        public
        flowStatus(WorkflowStatus.VotingSessionEnded)
        onlyOwner
    {
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
        );
    }

    function getWinner()
        public
        view
        flowStatus(WorkflowStatus.VotesTallied)
        returns (Proposal memory)
    {
        return proposals[winningProposalId];
    }
}
