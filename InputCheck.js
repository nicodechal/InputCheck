
/**
 * input-check 输入检查和限制
 * @author 王福秦，2016年9月5日
 * ===========================================
 * 包含功能
 * 1.字符数上限
 * 2.必填不能为空
 * 3.不能有空格
 * 4.只能纯中文字符或英文字符
 * 5.验证邮箱正确性
 * 6.电话号码正确性
 * ===========================================
 */

jQuery.fn.extend({
	inputCheck: function(arg) {
		// 立即检验
		var maxLength = (arg.maxLength == undefined) ? false : arg.maxLength;
		var noSpace = (arg.noSpace == undefined) ? false : arg.noSpace;
		var onlyChinese = (arg.onlyChinese == undefined) ? false : arg.onlyChinese;
		var onlyEnglish = (arg.onlyEnglish == undefined) ? false : arg.onlyEnglish;
		// 失去焦点检验
		var notEmpty = (arg.notEmpty == undefined) ? false : arg.notEmpty;
		var type = (arg.type == undefined) ? false : arg.type;
		var notAllow = (arg.notAllow == undefined) ? false : arg.notAllow;
		// 扩展
		var addCheck = (arg.addCheck == undefined) ? false : arg.addCheck;
		var addForbid = (arg.addForbid == undefined) ? false : arg.addForbid;
		// 自定义输出
		var resultWriter = (arg.resultWriter == undefined) ? writer : arg.resultWriter;


		var $this = $(this);
		var rePhone = /^1[3|4|5|7|8]\d{9}$/m;
		var reTel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,8}$/m;
		var reEmail = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/m;
		var reSpace = /\s+/;
		var reNotChinese = /[^\u2E80-\u9FFF]+/;
		var reNotEnglish = /[^a-zA-Z]+/;


		$(function() {
			$this.on('input propertychange', function() {
				var currentLength = $this.val().length;
				var flag = true;
				if (maxLength) {
					if (currentLength > maxLength) {
						resultWriter("输入字符数最多为" + maxLength + "个!");
						$this.val($this.val().substring(0, maxLength));
						flag = false;
					}
				}

				if (noSpace) {
					flag = flag && reTest(reSpace, "请勿输入空格!", "");
				}
				if (onlyChinese) {
					flag = flag && reTest(reNotChinese, "请勿输入非中文字符!", "");
				}
				if (onlyEnglish) {
					flag = flag && reTest(reNotEnglish, "请勿输入非英文字符!", "");
				}

				if (addForbid) {
					addForbid.tips = addForbid.tips == undefined ? "请勿输入该字符！" :
						addForbid.tips;
					addForbid.replace = addForbid.replace == undefined ? "" : addForbid
						.replace;
					flag = flag && reTest(addForbid.re, addForbid.tips, addForbid.replace);
				}

				if (flag) {
					resultWriter("");
				}
			});

			$this.on("blur", function() {
				if (type == "phone") {
					check(rePhone, "请输入正确手机号!");
				}
				if (type == "tel") {
					check(reTel, "请输入正确的固定电话!");
				}
				if (type == "email") {
					check(reEmail, "请输入正确的邮箱！");
				}

				if (addCheck) {
					addCheck.tips = addCheck.tips == undefined ? "请输入正确的内容" : addCheck.tips;
					check(addCheck.re, addCheck.tips);
				}

				if (notAllow.length > 0) {
					for (i in notAllow) {
						var re = new RegExp(notAllow[i]);
						if (re.test($this.val())) {
							resultWriter("内容不合法！");
							break;
						}
					}
				}

				if (notEmpty) {
					if ($this.val().length == 0) {
						resultWriter("该项目不能为空！");
					}
				}
			});
		});

		function reTest(re, tips, replace) {
			if (re.test($this.val())) {
				$this.val($this.val().replace(re, replace));
				resultWriter(tips);
				return false;
			}
			return true;
		}

		function check(re, tips) {
			if (!re.test($this.val()) && $this.val() != "") {
				resultWriter(tips);
			}
		}

		function writer(text) {
			$this.attr("data-placement", "auto bottom")
				.attr("data-content", text);
			if (text != "") {
				$this.popover('show');
				setTimeout(function() {
					$this.popover('hide');
				}, 2000);
			} else {
				$this.popover('hide');
			}
		}


		return function() {

			var $value = $this.val();
			var currentLength = $value.length;


			if ($value != "") {
				// 下方的判断未合并因为合并以后太长了...
				if (maxLength) {
					if (currentLength > maxLength) {
						return false;
					}
				}
				if (noSpace && reSpace.test($value)) {
					return false;
				}
				if (onlyChinese && reNotChinese.test($value)) {
					return false;
				}
				if (onlyEnglish && reNotEnglish.test($value)) {
					return false;
				}

				if (addForbid && (addForbid.re).test($value)) {
					return false;
				}
				if (type == "phone" && !rePhone.test($value)) {
					return false;
				}
				if (type == "tel" && !reTel.test($value)) {
					return false;
				}
				if (type == "email" && !reEmail.test($value)) {
					return false;
				}

				if (addCheck && !(addCheck.re).test($value)) {
					return false;
				}

				if (notAllow.length > 0) {
					for (i in notAllow) {
						var re = new RegExp(notAllow[i]);
						if (re.test($value)) {
							return false;
						}
					}
				}
			}

			if (notEmpty) {
				if ($value.length == 0) {
					return false;
				}
			}
			return true;
		};
	}
});
