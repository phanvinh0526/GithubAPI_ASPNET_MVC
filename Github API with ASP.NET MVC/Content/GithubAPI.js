

$(document).ready(function(){

    // Main function
    var funcFetchUser = function(){

        // Get value
        let username = $('#searchUserTxt').val();

        // Make a request to github
        $.ajax({
            url: 'https://api.github.com/users/'+username,
            data:{
                client_id: '6a673084c0abcb451feb',
                client_secret: '99a34d421b240d1fc0a3febddaae7d4ecb1bebe7'
            }
        }).done(function(user){
            // Make another request
            $.ajax({
                url: 'https://api.github.com/users/'+username+'/repos',
                data:{
                    client_id: '6a673084c0abcb451feb',
                    client_secret: '99a34d421b240d1fc0a3febddaae7d4ecb1bebe7',
                    sort: 'created: asc',
                    per_page: 10
                }
            }).done(function(repos){
                // jquery loop each repo
                $.each(repos, function(index, repo){
                    $('#repos').append(`
						<div class="well">
						<div class="row" style="margin-bottom: 10px">
							<div class="col-md-7">
								<strong>${repo.name}</strong>: ${repo.description}
                                <hr>
							</div>
							<div class="col-md-3">
								<span class="badge badge-primary">Forks: ${repo.forks_count}</span>
								<span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
								<span class="badge badge-success">Stars: ${repo.stargazers_count}</span>
								
							</div>
							<div class="col-md-2">
								<a href="${repo.html_url}" target="_blank" class="btn btn--blue reduce-size">Repo Page</a>
                                
							</div>
                            
						</div>
						</div>
					`)
				});
            })

            // Display user data
            $ ('#searchUserProfile').html(`
				<div class="panel panel-default">
					<div class="panel panel-default">
					<div class="panel-heading">
					 	<h4 class="display-4 h4">${user.name}</h4>
					</div>
					<div class="panel-body">
						<div class="row">
						<div class="col-md-3">
							<img class="thumbnail avatar" src="${user.avatar_url}"/>
							<a class="btn btn-primary btn-block" href="${user.html_url}">View Profile</a>
						</div>
						<div class="col-md-9">
							<span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
							<span class="badge badge-secondary">Public Gist: ${user.public_gists}</span>
							<span class="badge badge-success">Followers: ${user.followers}</span>
							<span class="badge badge-danger">Followings: ${user.followings}</span>
							<br></br>
							<ul class="list-group">
								<li class="list-group-item"><strong>Company</strong>:      ${user.company}</li>
								<li class="list-group-item"><strong>Website/blog</strong>: <a href="${user.blog}">${user.blog}</a></li>
								<li class="list-group-item"><strong>Location</strong>:     ${user.location}</li>
								<li class="list-group-item"><strong>Member since</strong>: ${user.creates_at}</li>
								
							</ul>
						</div>
						</div>
					 </div>
				</div>
				<br><br>
				<h4 class="display-4 h4">Latest Repos</h4>
				<div id="repos"></div>

				`);
        });
    }

    // catch events
    $('#searchUserTxt').on('keypress', function(e){

        console.log('in keypress');

        if(e.which == 13){
            funcFetchUser();
        }
    });

    $('#searchUserBtn').on('click', funcFetchUser);
});





