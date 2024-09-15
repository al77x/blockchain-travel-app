// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LoyaltyProgram {

    struct User {
        uint points;
        mapping(address => uint) pointsFromService;
    }

    mapping(address => User) public users;
    address public owner;

    event PointsIssued(address indexed user, address service, uint amount);
    event PointsRedeemed(address indexed user, uint amount);
    event PointsTransferred(address indexed from, address to, uint amount);

    constructor() {
        owner = msg.sender; 
    }

    // give points
    function issuePoints(address user, uint points, address serviceProvider) external {
        require(msg.sender == owner || msg.sender == serviceProvider, "Unauthorized");
        users[user].points += points;
        users[user].pointsFromService[serviceProvider] += points;
        emit PointsIssued(user, serviceProvider, points);
    }

    // redeem points
    function redeemPoints(uint points) external {
        require(users[msg.sender].points >= points, "Insufficient points");
        users[msg.sender].points -= points;
        emit PointsRedeemed(msg.sender, points);
    }

    // transfer points
    function transferPoints(address to, uint points) external {
        require(users[msg.sender].points >= points, "Insufficient points");
        users[msg.sender].points -= points;
        users[to].points += points;
        emit PointsTransferred(msg.sender, to, points);
    }

    // view points
    function viewPoints(address user) external view returns (uint) {
        return users[user].points;
    }
}
