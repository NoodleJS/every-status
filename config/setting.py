import web,yaml,os

config = yaml.load(open('config.yml'))
dbcfg = config['db']
render = web.template.render(config['tpl'],base="layout")
blankrender = web.template.render(config['tpl'])
db = web.database(dbn=dbcfg["name"],user=dbcfg["user"],pw=dbcfg["pwd"],db=dbcfg["db"])
web.config.debug = config['debug']

web.template.Template.globals['config'] = config
web.template.Template.globals['ENV'] = os.environ.get("ENV",None)
web.template.Template.globals['user'] = None
web.template.Template.globals['render'] = render
web.template.Template.globals['blankrender'] = blankrender