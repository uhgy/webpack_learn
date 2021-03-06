import React from 'react';
import {render} from 'react-dom';
import {browserHistory, Link} from 'react-router';
import requestApi from '../../middleware/request';
import auth from '../../middleware/auth';

var CreateArticle = React.createClass({
	getInitialState() {
		return {
			logged_in: auth.loggedIn(),
				title: "",
				introduction: "",
				content: "",
				created: false
		}
	},

	componentDidMount() {
		if(!this.state.logged_in) {
			setTimeout(
					function() {
						browserHistory.push('/login')
					}, 3000)
		}
	},
	/*
	  handleChange 分别绑定了title,introduction,content输入框
	 */

	handleChange(name, event) {
		var newState = {}
		newState[name] = event.target.value
		this.setState(newState)
	},

	handleSubmit(event) {
		event.preventDefault()
		var article = {
			'title': this.state.title,
			'introduction': this.state.introduction,
			'content': this.state.content
		}
		/*
		保存文章
		 */
		requestApi.storeArticle(article).pipe(
				function(res) {
					if(res && res['meta'] && res['meta']['code'] == 200) {
						this.setState({created: true})
						browserHistory.push('/article')
					}else {
						this.setState({created: false})
					}

				}.bind(this)
		)
	},

	render() {
		if(!this.state.logged_in) {
			return (
					<div>
						<p>You are not logged in, left 3s to jump to the login page... </p>
						<Link to="/login">Login page</Link>
					</div>
			)
		}
		return (
			<section>
				{this.state.created ? (<p>Success</p>) : (
					<article>
						<h2>Create a New Article</h2>
						<form className="article-form">
							<fieldset>
								<section>
									<label htmlFor="title">Title</label>
									<input type="text" id="title" name="title" value={this.state.title} onChange={this.handleChange.bind(this, 'title')}/>
								</section>
								<section>
									<label htmlFor="introduction">Introduction</label>
									<input type="text" id="introduction" name="introduction" value={this.state.introduction} onChange={this.handleChange.bind(this, 'introduction')}/>
								</section>
								<section>
									<label htmlFor="content">Content</label>
									<textarea id="content" name="content" value={this.state.content} onChange={this.handleChange.bind(this, 'content')}/>
								</section>
								<section>
									<button value="submit" onClick={this.handleSubmit}>提交</button>
								</section>
							</fieldset>
						</form>
					</article>
				)}
			</section>
		)
	}
})


export default CreateArticle;